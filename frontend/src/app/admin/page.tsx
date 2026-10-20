'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import BarChart from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import LineChart from '@/components/charts/LineChart';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);

  useEffect(() => {
    api.get('/documents/stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/products/admin/pending').then(r => setPendingProducts(r.data)).catch(() => {});
    api.get('/payments').then(r => setPendingPayments(r.data.filter((p:any) => p.status !== 'APPROVED'))).catch(() => {});
  }, []);

  const quickActions = [
    { label: 'Manage Products', desc: 'Inventory & Stock', icon: '📦', href: '/products', bg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' },
    { label: 'Manage Customers', desc: 'Client Directory', icon: '🧑‍💼', href: '/admin/customers', bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    { label: 'Manage Employees', desc: 'Staff & Roles', icon: '👥', href: '/admin/employees', bg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
    { label: 'Approve Payments', desc: 'Verify Transactions', icon: '💳', href: '/admin/payments', bg: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)' },
  ];

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1400, margin: '0 auto', fontFamily: 'Inter, sans-serif', paddingBottom: 40 }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Dashboard Overview</h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>System Overview & Quick Actions</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/admin/documents" style={{ background: '#1E88E5', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 10px rgba(30,136,229,0.3)' }}>+ New Quote</Link>
            <Link href="/admin/documents" style={{ background: '#0D2B4E', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 10px rgba(13,43,78,0.3)' }}>+ New Poster</Link>
          </div>
        </div>

        {/* ROW 1: Interactive Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} style={{ 
              background: action.bg, borderRadius: 16, padding: 20, textDecoration: 'none', color: '#fff',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden',
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)', transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{action.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{action.label}</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>{action.desc}</div>
              <div style={{ position: 'absolute', right: 20, bottom: 20, fontSize: 20, opacity: 0.5 }}>→</div>
            </Link>
          ))}
        </div>

        {/* ROW 2: Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Jobs</div>
            <div style={{ fontSize: 42, fontWeight: 800, color: '#0D2B4E', lineHeight: 1, marginTop: 10, marginBottom: 10 }}>28</div>
            <BarChart data={[8, 12, 9, 15, 11, 18, 14, 22, 28]} color="#0D2B4E" height={80} />
          </div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Attendance</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <DonutChart percent={85} size={110} color="#0D2B4E" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0D2B4E' }}>Present <span style={{ color: '#10b981' }}>85%</span></div>
                <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Absent 15%</div>
              </div>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0D2B4E', marginTop: 10, marginBottom: 4 }}>KSH 1,240,500</div>
            <LineChart data={[4, 8, 12, 9, 15, 18, 22, 26, 30]} color="#1E88E5" height={70} />
          </div>
        </div>

        {/* ROW 3: Overview of Other Pages */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(300px, 1fr)', gap: 20 }}>
          
          {/* Recent Documents (Overview of PDF Page) */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Recent Documents</h2>
              <Link href="/admin/documents/history" style={{ fontSize: 12, color: '#1E88E5', fontWeight: 700, textDecoration: 'none' }}>View All</Link>
            </div>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ paddingBottom: 8 }}>Serial</th><th style={{ paddingBottom: 8 }}>Client</th><th style={{ paddingBottom: 8 }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentDocs?.length === 0 ? <tr><td colSpan={3} style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>No documents yet</td></tr> :
                 stats?.recentDocs?.slice(0, 5).map((d: any) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 0', fontWeight: 700, fontFamily: 'monospace' }}>{d.serialNo}</td>
                    <td>{d.clientName}</td>
                    <td style={{ fontWeight: 700 }}>KSH {Number(d.total || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pending Items (Overview of Products & Payments) */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0D2B4E', marginBottom: 16 }}>Pending Approvals</h2>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>
                <span>Products ({pendingProducts.length})</span>
                <Link href="/products" style={{ color: '#1E88E5', textDecoration: 'none' }}>Manage</Link>
              </div>
              {pendingProducts.length === 0 ? <div style={{ fontSize: 12, color: '#94a3b8' }}>No pending products</div> : 
                pendingProducts.slice(0, 3).map(p => (
                  <div key={p.id} style={{ fontSize: 13, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>{p.name}</div>
                ))
              }
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>
                <span>Payments ({pendingPayments.length})</span>
                <Link href="/admin/payments" style={{ color: '#1E88E5', textDecoration: 'none' }}>Manage</Link>
              </div>
              {pendingPayments.length === 0 ? <div style={{ fontSize: 12, color: '#94a3b8' }}>No pending payments</div> : 
                pendingPayments.slice(0, 3).map(p => (
                  <div key={p.id} style={{ fontSize: 13, padding: '8px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{p.reference}</span>
                    <span style={{ fontWeight: 700 }}>KES {Number(p.amount).toLocaleString()}</span>
                  </div>
                ))
              }
            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
}
