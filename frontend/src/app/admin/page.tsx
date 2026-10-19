'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/documents/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1400, margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
        
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>Welcome back, Super Admin</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 20 }}>
          
          {/* COLUMN 1: Estimates/Quotes Dashboard */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0D2B4E', marginBottom: 16 }}>Estimates/Quotes Dashboard</h2>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <Link href="/admin/documents" style={{ flex: 1, background: '#1E88E5', color: '#fff', padding: '8px 0', textAlign: 'center', borderRadius: 6, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Create Quote</Link>
              <button style={{ flex: 1, background: '#fff', color: '#1E88E5', border: '1px solid #1E88E5', padding: '8px 0', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Send Quote</button>
            </div>
            
            <div style={{ border: '1px solid #f1f5f9', borderRadius: 8, padding: 12, background: '#f8fafc', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0D2B4E' }}>Client Name</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Draft: #ED451</div>
            </div>

            <div style={{ border: '1px solid #f1f5f9', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0D2B4E' }}>Pending Model X (a-tount)</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Quote #1203</div>
              </div>
              <span style={{ color: '#94a3b8' }}>›</span>
            </div>
          </div>

          {/* COLUMN 2: Quick Draft Builder */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0D2B4E' }}>Save as Draft</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ background: '#1E88E5', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Send</button>
                <button style={{ background: '#e2e8f0', color: '#0D2B4E', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Approve</button>
              </div>
            </div>
            
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0D2B4E', marginBottom: 12 }}>Draft #ED451 for Solar Array</div>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: '#64748b', textAlign: 'left' }}>
                    <th style={{ paddingBottom: 8 }}>Description</th>
                    <th style={{ paddingBottom: 8 }}>Qty</th>
                    <th style={{ paddingBottom: 8 }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: '6px 0' }}>Panel Installation</td><td>1</td><td>$15.00</td></tr>
                  <tr><td style={{ padding: '6px 0' }}>Inverter Model X</td><td>1</td><td>$30.00</td></tr>
                </tbody>
              </table>
              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#0D2B4E' }}>
                <span>Sub-Total</span>
                <span>KSH 350.00</span>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Invoicing Status Tracker (REAL-TIME DATA) */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0D2B4E', margin: '0 0 16px 0' }}>Invoicing Status Tracker</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                <div><div style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E' }}>Estimates</div><div style={{ fontSize: 11, color: '#64748b' }}>Sent and accepted</div></div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1E88E5' }}>{stats?.totalQuotes || 0}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                <div><div style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E' }}>Approved</div><div style={{ fontSize: 11, color: '#64748b' }}>Pending conversion</div></div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>{stats?.approvedQuotes || 0}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8 }}>
                <div><div style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E' }}>Invoices</div><div style={{ fontSize: 11, color: '#64748b' }}>Sent and paid</div></div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>{stats?.totalInvoices || 0}</div>
              </div>
            </div>
            
            <div style={{ marginTop: 16, background: '#f8fafc', borderRadius: 8, padding: 12, border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>Aging: Receivables Over time</div>
              <svg viewBox="0 0 100 40" style={{ width: '100%', height: 60 }}>
                <path d="M0,40 L10,35 L30,20 L50,25 L70,10 L100,5 L100,40 Z" fill="#DBEAFE" stroke="#1E88E5" strokeWidth="2" />
              </svg>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0D2B4E', margin: '0 0 16px 0' }}>Recent Invoices & Conversions</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ paddingBottom: 8 }}>Invoice</th>
                  <th style={{ paddingBottom: 8 }}>Client</th>
                  <th style={{ paddingBottom: 8 }}>Amount (KSH)</th>
                  <th style={{ paddingBottom: 8 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentDocs?.length === 0 ? <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>No documents yet</td></tr> :
                 stats?.recentDocs?.map((d: any) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 0', fontWeight: 700, color: '#0D2B4E' }}>{d.serialNo}</td>
                    <td>{d.clientName || 'Walk-in'}</td>
                    <td style={{ fontWeight: 700 }}>{Number(d.total || 0).toLocaleString()}</td>
                    <td style={{ color: '#64748b' }}>{new Date(d.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0D2B4E', margin: '0 0 16px 0' }}>Quick Generators</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Link href="/admin/documents" style={{ background: 'linear-gradient(135deg, #1E88E5, #1565C0)', color: '#fff', padding: 16, borderRadius: 8, textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>🧾 Create Quote/Invoice</Link>
              <Link href="/admin/documents" style={{ background: 'linear-gradient(135deg, #0D2B4E, #1E3A5F)', color: '#fff', padding: 16, borderRadius: 8, textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>🖼️ Generate Poster</Link>
            </div>
            <Link href="/admin/projects" style={{ marginTop: 12, background: '#f1f5f9', color: '#0D2B4E', padding: 16, borderRadius: 8, textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>📅 View Gantt Work Plan</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
