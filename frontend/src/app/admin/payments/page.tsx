'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    api.get('/payments').then(r => setPayments(r.data)).catch(() => {});
    api.get('/documents').then(r => setDocs(r.data)).catch(() => {});
  }, []);

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)', gap: 20 }}>
        
        {/* LEFT: Payments Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0D2B4E', margin: '0 0 16px 0' }}>All System Payments</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '10px 0' }}>Ref</th>
                  <th style={{ padding: '10px 0' }}>Phone</th>
                  <th style={{ padding: '10px 0' }}>Amount (KSH)</th>
                  <th style={{ padding: '10px 0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>No payments recorded yet.</td></tr> : 
                 payments.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 0', fontWeight: 700, fontFamily: 'monospace' }}>{p.reference}</td>
                    <td>{p.customerPhone}</td>
                    <td style={{ fontWeight: 700 }}>{Number(p.amount).toLocaleString()}</td>
                    <td>
                      <span style={{ 
                        background: p.status === 'APPROVED' ? '#DCFCE7' : p.status === 'FAILED' ? '#FEE2E2' : '#FEF3C7', 
                        color: p.status === 'APPROVED' ? '#166534' : p.status === 'FAILED' ? '#991B1B' : '#92400E', 
                        padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700 
                      }}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Invoices (From Image 1) */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0D2B4E', margin: '0 0 16px 0' }}>Recent Invoices & Conversions</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '10px 0' }}>Invoice</th>
                  <th style={{ padding: '10px 0' }}>Date</th>
                  <th style={{ padding: '10px 0' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {docs.filter(d => d.type === 'INVOICE').slice(0,5).map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 0', fontWeight: 700, color: '#1E88E5' }}>{d.serialNo}</td>
                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 700 }}>KSH {Number(d.total).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Invoicing Tracker (From Image 1) */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0D2B4E', margin: '0 0 20px 0' }}>Invoicing Status Tracker</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
              <div><div style={{ fontWeight: 700, fontSize: 13 }}>Estimates</div><div style={{ fontSize: 11, color: '#64748b' }}>Sent and accepted</div></div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>18</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
              <div><div style={{ fontWeight: 700, fontSize: 13 }}>Approved</div><div style={{ fontSize: 11, color: '#64748b' }}>Pending conversion</div></div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#16A34A' }}>10</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
              <div><div style={{ fontWeight: 700, fontSize: 13 }}>Invoices</div><div style={{ fontSize: 11, color: '#64748b' }}>Sent and paid</div></div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1E88E5' }}>5</div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
