'use client';
import Layout from '@/components/Layout';
import { api, UPLOADS_URL } from '@/lib/api';
import { connectAdminSocket } from '@/lib/socket';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [pending, setPending] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(u);
    api.get('/reports/summary').then((r) => setSummary(r.data)).catch(() => {});
    api.get('/products/admin/pending').then((r) => setPending(r.data)).catch(() => {});
    api.get('/payments').then((r) => setPayments(r.data)).catch(() => {});
    connectAdminSocket((event, data) => {
      setActivities((prev) =>
        [{ event, data, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 15)
      );
    });
  }, []);

  const approveProduct = async (id: string) => {
    await api.put(`/products/${id}/approve`);
    setPending((p) => p.filter((x) => x.id !== id));
  };
  const rejectProduct = async (id: string) => {
    await api.put(`/products/${id}/reject`);
    setPending((p) => p.filter((x) => x.id !== id));
  };
  const approvePayment = async (id: string) => {
    await api.put(`/payments/${id}/approve`);
    setPayments((p) => p.map((x) => (x.id === id ? { ...x, status: 'APPROVED' } : x)));
  };

  const pendingPaymentCount = payments.filter((p) => p.status !== 'APPROVED').length;

  const stats = summary
    ? [
        { label: 'Users', value: summary.users, icon: '👥', color: '#1E88E5', href: '/admin/employees', trend: '+2 this week' },
        { label: 'Products', value: summary.products, icon: '📦', color: '#2E7D32', href: '/products', trend: 'Active inventory' },
        { label: 'Quotations', value: summary.quotations, icon: '📄', color: '#7C3AED', href: '/quotations', trend: 'Sent to clients' },
        { label: 'Payments', value: summary.payments, icon: '💳', color: '#0891B2', href: '/admin/payments', trend: 'All transactions' },
        { label: 'Logs', value: summary.logs, icon: '📋', color: '#475569', href: '/admin/logs', trend: 'System events' },
        { label: 'Alerts', value: summary.alerts, icon: '🚨', color: '#DC2626', href: '/admin/logs', trend: 'Needs attention' },
      ]
    : [];

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ============ HERO ============ */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0D2B4E 0%, #1E88E5 100%)',
            borderRadius: '20px',
            padding: '32px 36px',
            marginBottom: '28px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(13, 43, 78, 0.25)',
          }}
        >
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(79,195,247,0.25) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, opacity: 0.7, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Admin Dashboard
            </div>
            <h1 style={{ fontSize: '30px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Welcome back, {user?.name || 'Super Admin'} 👋
            </h1>
            <p style={{ fontSize: '14px', opacity: 0.85, marginTop: '8px', marginBottom: 0 }}>
              Managing Infield Engineering operations in real-time
            </p>
          </div>
        </div>

        {/* ============ STATS GRID ============ */}
        {summary && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            {stats.map((c) => (
              <a
                key={c.label}
                href={c.href}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #F1F5F9',
                  padding: '20px',
                  textDecoration: 'none',
                  boxShadow: '0 1px 3px rgba(13, 43, 78, 0.06)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = `0 12px 28px ${c.color}30`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = c.color;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(13, 43, 78, 0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#F1F5F9';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      background: `linear-gradient(135deg, ${c.color}20 0%, ${c.color}10 100%)`,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                    }}
                  >
                    {c.icon}
                  </div>
                  <div style={{ width: '8px', height: '8px', background: c.color, borderRadius: '50%', boxShadow: `0 0 0 4px ${c.color}20` }} />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#0D2B4E', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                  {c.value}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {c.label}
                </div>
                <div style={{ fontSize: '11px', color: c.color, fontWeight: 600, marginTop: '6px' }}>
                  {c.trend}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* ============ QUICK ACTIONS ============ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '28px',
          }}
        >
          {[
            { label: 'Manage Employees', icon: '👥', href: '/admin/employees', bg: 'linear-gradient(135deg, #0D2B4E 0%, #1E3A5F 100%)', color: '#fff' },
            { label: 'Manage Customers', icon: '🧑‍💼', href: '/admin/customers', bg: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)', color: '#fff' },
            { label: 'Profile & Password', icon: '⚙️', href: '/admin/profile', bg: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)', color: '#0D2B4E' },
            { label: 'Approve Payments', icon: '💳', href: '/admin/payments', bg: '#FFFFFF', color: '#1E88E5', border: '2px solid #1E88E5' },
          ].map((action: any) => (
            <a
              key={action.href}
              href={action.href}
              style={{
                background: action.bg,
                color: action.color,
                padding: '16px 20px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '14px',
                textAlign: 'center',
                border: action.border || 'none',
                boxShadow: '0 4px 12px rgba(13, 43, 78, 0.10)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(30, 136, 229, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 43, 78, 0.10)';
              }}
            >
              <span style={{ fontSize: '18px' }}>{action.icon}</span>
              <span>{action.label}</span>
            </a>
          ))}
        </div>

        {/* ============ PENDING SECTIONS ============ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          {/* Pending Products */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #F1F5F9',
              padding: '22px',
              boxShadow: '0 1px 3px rgba(13, 43, 78, 0.06)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0D2B4E', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ display: 'inline-block', width: '4px', height: '18px', background: '#1E88E5', borderRadius: '2px' }} />
                Pending Products
              </h2>
              <span style={{ background: pending.length > 0 ? '#FEF3C7' : '#F1F5F9', color: pending.length > 0 ? '#92400E' : '#64748b', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>
                {pending.length}
              </span>
            </div>

            {pending.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: '13px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.5 }}>✓</div>
                No pending products
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                {pending.slice(0, 5).map((p) => (
                  <div key={p.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '12px', padding: '12px', transition: 'all 0.15s' }}>
                    {p.imageUrl ? (
                      <img src={`${UPLOADS_URL}${p.imageUrl}`} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', background: '#E2E8F0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>📦</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0D2B4E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: '#1E88E5', fontWeight: 700, marginTop: '2px' }}>KES {Number(p.price).toLocaleString()}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => approveProduct(p.id)} style={{ background: '#2E7D32', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', transition: 'all 0.15s' }} onMouseOver={(e) => (e.currentTarget.style.background = '#1B5E20')} onMouseOut={(e) => (e.currentTarget.style.background = '#2E7D32')} title="Approve">✓</button>
                      <button onClick={() => rejectProduct(p.id)} style={{ background: '#DC2626', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', transition: 'all 0.15s' }} onMouseOver={(e) => (e.currentTarget.style.background = '#B91C1C')} onMouseOut={(e) => (e.currentTarget.style.background = '#DC2626')} title="Reject">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Payments */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #F1F5F9', padding: '22px', boxShadow: '0 1px 3px rgba(13, 43, 78, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0D2B4E', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ display: 'inline-block', width: '4px', height: '18px', background: '#0891B2', borderRadius: '2px' }} />
                Pending Payments
              </h2>
              <span style={{ background: pendingPaymentCount > 0 ? '#FEF3C7' : '#F1F5F9', color: pendingPaymentCount > 0 ? '#92400E' : '#64748b', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>
                {pendingPaymentCount}
              </span>
            </div>

            {pendingPaymentCount === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: '13px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.5 }}>✓</div>
                No pending payments
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                {payments.filter((p) => p.status !== 'APPROVED').slice(0, 5).map((p) => (
                  <div key={p.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0D2B4E', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.reference}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{p.customerPhone} • KES {Number(p.amount).toLocaleString()}</div>
                    </div>
                    <button onClick={() => approvePayment(p.id)} style={{ background: '#2E7D32', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap', transition: 'all 0.15s' }} onMouseOver={(e) => (e.currentTarget.style.background = '#1B5E20')} onMouseOut={(e) => (e.currentTarget.style.background = '#2E7D32')}>Approve</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ============ LIVE ACTIVITY ============ */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #F1F5F9', padding: '22px', boxShadow: '0 1px 3px rgba(13, 43, 78, 0.06)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0D2B4E', margin: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ width: '8px', height: '8px', background: '#DC2626', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            Live Activity
          </h2>
          {activities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: '13px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.5 }}>📡</div>
              Waiting for live events…
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {activities.map((a, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < activities.length - 1 ? '1px solid #F1F5F9' : 'none', fontSize: '13px' }}>
                  <span style={{ fontWeight: 700, color: '#1E88E5', fontFamily: 'monospace' }}>{a.event}</span>
                  <span style={{ color: '#94a3b8', fontSize: '11px' }}>{a.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
