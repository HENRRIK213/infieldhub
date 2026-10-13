import React, { useEffect, useState, createContext, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { io } from 'socket.io-client';
import { API_URL, UPLOADS_URL, BACKEND_URL } from './config';

const AuthContext = createContext(null);

const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const socket = io(BACKEND_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <StatusBar style="light" />
      {user ? <MainApp /> : <LoginScreen />}
    </AuthContext.Provider>
  );
}

function LoginScreen() {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('admin@infieldhub.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.requires2FA) {
        Alert.alert('2FA Required', 'Please log in via the web to complete 2FA.');
        return;
      }
      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (err) {
      Alert.alert('Login failed', err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.loginContainer}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.logoWrap}>
          <View style={styles.logoBox}>
            <Image
              source={require('./assets/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>InfieldHub Command</Text>
          <Text style={styles.subtitle}>Solar • Electrical • Water Solutions</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={login}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.btnText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MainApp() {
  const { user, setUser } = useContext(AuthContext);
  const [tab, setTab] = useState('live');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      socket.auth = { token };
      socket.connect();
      socket.emit('joinAdmin');
    })();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('force-logout', async () => {
      await AsyncStorage.clear();
      setUser(null);
      Alert.alert('Logged out', 'Your session was ended by an administrator.');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('force-logout');
      socket.disconnect();
    };
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
  };

  const tabs = [
    { key: 'live', label: 'LIVE' },
    { key: 'products', label: 'PRODUCTS' },
    { key: 'payments', label: 'PAYMENTS' },
    { key: 'logs', label: 'LOGS' },
    { key: 'alerts', label: 'ALERTS' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>InfieldHub Command</Text>
          <Text style={styles.headerSub}>
            {connected ? '🟢 Live' : '🔴 Offline'} • {user?.email}
          </Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {tabs.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, tab === t.key && styles.tabActive]}
              onPress={() => setTab(t.key)}
            >
              <Text
                style={[styles.tabText, tab === t.key && styles.tabTextActive]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={{ flex: 1 }}>
        {tab === 'live' && <LiveFeed />}
        {tab === 'products' && <PendingProducts />}
        {tab === 'payments' && <Payments />}
        {tab === 'logs' && <Logs />}
        {tab === 'alerts' && <Alerts />}
      </View>
    </SafeAreaView>
  );
}

function LiveFeed() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const handlers = [
      'product:new',
      'product:approved',
      'quotation:new',
      'payment:approved',
      'payment:received',
    ];
    const add = (ev) => (data) =>
      setEvents((prev) =>
        [{ ev, data, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 100)
      );
    handlers.forEach((ev) => socket.on(ev, add(ev)));
    return () => handlers.forEach((ev) => socket.off(ev));
  }, []);

  return (
    <FlatList
      data={events}
      keyExtractor={(_, i) => i.toString()}
      contentContainerStyle={{ padding: 12 }}
      ListEmptyComponent={
        <Text style={styles.empty}>Waiting for live events…</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.eventItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eventTitle}>{item.ev}</Text>
            <Text style={styles.eventDetail} numberOfLines={2}>
              {JSON.stringify(item.data).slice(0, 120)}
            </Text>
          </View>
          <Text style={styles.eventTime}>{item.time}</Text>
        </View>
      )}
    />
  );
}

function PendingProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/products/admin/pending');
      setItems(r.data);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await api.put(`/products/${id}/approve`);
    setItems(items.filter((i) => i.id !== id));
  };
  const reject = async (id) => {
    await api.put(`/products/${id}/reject`);
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(i) => i.id}
      contentContainerStyle={{ padding: 12 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      ListEmptyComponent={<Text style={styles.empty}>No pending products.</Text>}
      renderItem={({ item }) => (
        <View style={styles.cardItem}>
          {item.imageUrl && (
            <Image
              source={{ uri: `${UPLOADS_URL}${item.imageUrl}` }}
              style={styles.thumb}
            />
          )}
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemDesc} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.itemPrice}>KES {item.price}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.btnSuccess}
              onPress={() => approve(item.id)}
            >
              <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnDanger}
              onPress={() => reject(item.id)}
            >
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

function Payments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/payments');
      setItems(r.data);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await api.put(`/payments/${id}/approve`);
    load();
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(i) => i.id}
      contentContainerStyle={{ padding: 12 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      ListEmptyComponent={<Text style={styles.empty}>No payments yet.</Text>}
      renderItem={({ item }) => (
        <View style={styles.cardItem}>
          <View style={styles.rowBetween}>
            <Text style={styles.itemTitle}>{item.reference}</Text>
            <View style={styles.badge(item.status === 'APPROVED')}>
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.itemDesc}>{item.customerPhone}</Text>
          <Text style={styles.itemPrice}>KES {item.amount}</Text>
          {item.status !== 'APPROVED' && (
            <TouchableOpacity
              style={styles.btnSuccess}
              onPress={() => approve(item.id)}
            >
              <Text style={styles.btnText}>Approve Payment</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
}

function Logs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/logs?limit=100');
      setItems(r.data.logs || []);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const remove = (id) => {
    Alert.alert('Delete Log', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await api.delete(`/logs/${id}`);
          load();
        },
      },
    ]);
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(i) => i.id}
      contentContainerStyle={{ padding: 12 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      ListEmptyComponent={<Text style={styles.empty}>No logs yet.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.logItem}
          onLongPress={() => remove(item.id)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.logAction}>{item.action}</Text>
            <Text style={styles.logUser}>{item.user?.email || '-'}</Text>
            <Text style={styles.logDetail} numberOfLines={2}>
              {item.details}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.logTime}>
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
            <Text style={styles.logIface}>{item.interface || '-'}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

function Alerts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/logs/alerts');
      setItems(r.data);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const resolve = async (id) => {
    await api.put(`/logs/alerts/${id}/resolve`);
    load();
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(i) => i.id}
      contentContainerStyle={{ padding: 12 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      ListEmptyComponent={<Text style={styles.empty}>No security alerts.</Text>}
      renderItem={({ item }) => (
        <View style={styles.cardItem}>
          <View style={styles.rowBetween}>
            <Text style={styles.itemTitle}>{item.type}</Text>
            <View style={styles.badge(item.severity === 'HIGH')}>
              <Text style={styles.badgeText}>{item.severity}</Text>
            </View>
          </View>
          <Text style={styles.itemDesc}>{item.message}</Text>
          {!item.resolved && (
            <TouchableOpacity
              style={styles.btnSuccess}
              onPress={() => resolve(item.id)}
            >
              <Text style={styles.btnText}>Mark Resolved</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loginContainer: { flex: 1, backgroundColor: '#0D2B4E', padding: 20 },
  logoWrap: { alignItems: 'center', marginBottom: 30 },
  logoBox: {
    width: 120,
    height: 120,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 12,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: { width: 96, height: 96 },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#4FC3F7', fontSize: 12, marginTop: 4 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20 },
  label: {
    color: '#0D2B4E',
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F0F4FA',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0D2B4E',
  },
  header: {
    backgroundColor: '#0D2B4E',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  headerSub: { color: '#4FC3F7', fontSize: 11, marginTop: 2 },
  logoutBtn: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  tabsWrap: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5EAF2',
  },
  tabs: { paddingHorizontal: 4 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#1E88E5' },
  tabText: { color: '#999', fontSize: 11, fontWeight: '700' },
  tabTextActive: { color: '#1E88E5' },
  btnPrimary: {
    backgroundColor: '#1E88E5',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  btnSuccess: {
    backgroundColor: '#2E7D32',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    marginTop: 8,
    alignItems: 'center',
  },
  btnDanger: {
    backgroundColor: '#C62828',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    marginTop: 8,
    alignItems: 'center',
  },
  btnText: { color: '#FFF', fontWeight: '600', fontSize: 13 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 14 },
  eventItem: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTitle: { color: '#1E88E5', fontWeight: '700', fontSize: 13 },
  eventDetail: { color: '#666', fontSize: 11, marginTop: 2 },
  eventTime: { color: '#999', fontSize: 11, marginLeft: 8 },
  cardItem: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  thumb: { width: '100%', height: 160, borderRadius: 8, marginBottom: 8 },
  itemTitle: { color: '#0D2B4E', fontWeight: '700', fontSize: 15 },
  itemDesc: { color: '#666', fontSize: 12, marginTop: 2 },
  itemPrice: {
    color: '#1E88E5',
    fontWeight: '800',
    fontSize: 16,
    marginTop: 4,
  },
  row: { flexDirection: 'row', marginTop: 10 },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: (danger) => ({
    backgroundColor: danger ? '#C62828' : '#F9A825',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  }),
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  logItem: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logAction: { color: '#1E88E5', fontWeight: '700', fontSize: 13 },
  logUser: { color: '#0D2B4E', fontSize: 12, marginTop: 2 },
  logDetail: { color: '#666', fontSize: 11, marginTop: 2 },
  logTime: { color: '#999', fontSize: 11 },
  logIface: { color: '#4FC3F7', fontSize: 10, marginTop: 2, fontWeight: '600' },
});