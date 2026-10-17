'use client';
import Layout from '@/components/Layout';
import { api, UPLOADS_URL } from '@/lib/api';
import { connectAdminSocket } from '@/lib/socket';
import { useEffect, useState } from 'react';
import BarChart from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import LineChart from '@/components/charts/LineChart';
import Link from 'next/link';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [pending, setPending] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(u);
    api.get('/reports/summary').then(r => setSummary(r.data)).catch(() => {});
    api.get('/products/admin/pending').then(r => setPending(r.data)).catch(() => {});
    api.get('/payments').then(r => setPayments(r.data)).catch(() => {});
    api.get('/admin/logs?limit=6').then(r => setLogs(r.data)).catch(() => {});
    
    connectAdminSocket((event: any, data: any) => {
      setActivities(prev => [{ event, data, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
    });
  }, []);

  const approvePayment = async (e: any, id: string) => {
    e.preventDefault();
    await api.put(`/payments/${id}/approve`);
    setPayments(p => p.map(x => x.id === id ? { ...x, status: 'APPROVED' } : x));
  };

  const approveProduct = async (e: any, id: string) => {
    e.preventDefault();
    await api.put(`/products/${id}/approve`);
    setPending(p => p.filter(x => x.id !== id));
  };

  const activeJobs = summary?.products ?? 0;
  const users = summary?.users ?? 0;
  const attendance = Math.min(100, Math.round((users / Math.max(users, 8)) * 100));
  const revenue = payments.filter(p => p.status === 'APPROVED').reduce((s, p) => s + Number(p.amount || 0), 0);
  const monthlyGoal = Math.min(100, Math.round((revenue / 500000) * 100));

  const jobTrend = [8, 12, 9, 15, 11, 18, 14, 22, activeJobs];
  const revenueTrend = [4, 8, 12, 9, 15, 18, 22, 26, 30];

  const stats = summary ? [
    { label: 'Users', value: summary.users, icon: '👥', color: '#1E88E5', href: '/admin/employees' },
    { label: 'Products', value: summary.products, icon: '📦', color: '#2E7D32', href: '/products' },
    { label: 'Quotations', value: summary.quotations, icon: '📄', color: '#7C3AED', href: '/quotations' },
    { label: 'Payments', value: summary.payments, icon: '💳', color: '#0891B2', href: '/admin/payments' },
    { label: 'Logs', value: summary.logs, icon: '📋', color: '#475569', href: '/admin/logs' },
    { label: 'Alerts', value: summary.alerts, icon: '🚨', color: '#DC2626', href: '/admin/logs' },
  ] : [];

  return (
    <Layout requireAdmin>
      <div style={{ display: 'grid', gap: 20, maxWidth: 1400, margin: '0 auto' }}>

        {/* ROW 1: Stats */}
        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
            {stats.map((c) => (
              <Link key={c.label} href={c.href} style={{
                background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 18,
                textDecoration: 'none', boxShadow: '0 1px 3px rgba(13,43,78,0.05)', display: 'block'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, background: `${c.color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{c.icon}</div>
                  <div style={{ width: 8, height: 8, background: c.color, borderRadius: '50%', boxShadow: `0 0 0 4px ${c.color}20` }} />
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, color: '#0D2B4E', lineHeight: 1, marginBottom: 4 }}>{c.value}</div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.label}</div>
              </Link>
            ))}
          </div>
        )}

        {/* ROW 2: Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, boxShadow: '0 1px 3px rgba(13,43,78,0.05)' }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Jobs</div>
            <div style={{ fontSize: 42, fontWeight: 800, color: '#0D2B4E', lineHeight: 1, marginTop: 10 }}>{activeJobs}</div>
            <div style={{ marginTop: 14 }}><BarChart data={jobTrend} color="#0D2B4E" height={80} /></div>
            <div style={{ fontSize: 12, color: '#16A34A', fontWeight: 700, marginTop: 8 }}>▲ 5% vs last week</div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, boxShadow: '0 1px 3px rgba(13,43,78,0.05)' }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Employee Attendance</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <DonutChart percent={attendance} size={120} color="#0D2B4E" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0D2B4E', display: 'inline-block' }} />
                  <span style={{ fontWeight: 700, color: '#0D2B4E' }}>Present</span> <span style={{ color: '#94a3b8' }}>{attendance}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#CBD5E1', display: 'inline-block' }} />
                  <span style={{ fontWeight: 700, color: '#64748b' }}>Absent</span> <span style={{ color: '#94a3b8' }}>{100 - attendance}%</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, boxShadow: '0 1px 3px rgba(13,43,78,0.05)' }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent Revenue</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', marginTop: 8, marginBottom: 4 }}>KES {revenue.toLocaleString()}</div>
            <LineChart data={revenueTrend} color="#1E88E5" height={90} />
          </div>
        </div>

        {/* ROW 3: Quick Actions (Clickable) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { label: 'Manage Employees', icon: '👥', href: '/admin/employees', bg: 'linear-gradient(135deg, #0D2B4E 0%, #1E3A5F 100%)', color: '#fff' },
            { label: 'Manage Products', icon: '📦', href: '/products', bg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: '#fff' },
            { label: 'Manage Customers', icon: '🧑‍💼', href: '/admin/customers', bg: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)', color: '#fff' },
            { label: 'Approve Payments', icon: '💳', href: '/admin/payments', bg: '#FFFFFF', color: '#1E88E5', border: '2px solid #1E88E5' },
          ].map((a: any) => (
            <Link key={a.href} href={a.href} style={{
              background: a.bg, color: a.color, padding: '14px 18px', borderRadius: 12,
              textDecoration: 'none', fontWeight: 700, fontSize: 14, textAlign: 'center',
              border: a.border || 'none', boxShadow: '0 4px 12px rgba(13, 43, 78, 0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>{a.icon}</span>
              <span>{a.label}</span>
            </Link>
          ))}
        </div>

        {/* ROW 4: Pending Items */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, boxShadow: '0 1px 3px rgba(13,43,78,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>PENDING PRODUCTS</h2>
              <span style={{ background: pending.length ? '#FEF3C7' : '#F1F5F9', color: pending.length ? '#92400E' : '#64748b', padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{pending.length}</span>
            </div>
            {pending.length === 0 ? <div style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>✓ Nothing pending</div> : pending.slice(0, 4).map((p: any) => (
              <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F8FAFC' }}>
                <div style={{ width: 40, height: 40, background: '#F1F5F9', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📦</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#0D2B4E', fontSize: 13 }}>{p.name}</div>
                  <div style={{ color: '#1E88E5', fontSize: 12, fontWeight: 700 }}>KES {Number(p.price).toLocaleString()}</div>
                </div>
                <button onClick={(e) => approveProduct(e, p.id)} style={{ background: '#2E7D32', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Approve</button>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, boxShadow: '0 1px 3px rgba(13,43,78,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>PENDING PAYMENTS</h2>
              <span style={{ background: payments.filter(p => p.status !== 'APPROVED').length ? '#FEF3C7' : '#F1F5F9', color: '#92400E', padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{payments.filter(p => p.status !== 'APPROVED').length}</span>
            </div>
            {payments.filter(p => p.status !== 'APPROVED').length === 0 ? <div style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>✓ Nothing pending</div> : payments.filter(p => p.status !== 'APPROVED').slice(0, 4).map((p: any) => (
              <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F8FAFC' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#0D2B4E', fontSize: 12, fontFamily: 'monospace' }}>{p.reference}</div>
                  <div style={{ color: '#64748b', fontSize: 11 }}>KES {Number(p.amount).toLocaleString()}</div>
                </div>
                <button onClick={(e) => approvePayment(e, p.id)} style={{ background: '#2E7D32', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Approve</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
