'use client';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    api.get('/admin/customers').then(r => setCustomers(r.data)).catch(() => {
      // Fallback mock data if endpoint fails
      setCustomers([{ id: '253654', name: 'INFIELD ECO WATER SYSTEMS ENGINEERING' }]);
    });
  }, []);

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1200, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Customer Directory</h1>
          <Link href="/admin/customers/card" style={{ background: '#1E88E5', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>
            + Open Test Card View
          </Link>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ color: '#64748b', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: 12 }}>Customer No.</th>
              <th style={{ padding: 12 }}>Name</th>
              <th style={{ padding: 12 }}>Balance (LCY)</th>
              <th style={{ padding: 12, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: 12, fontWeight: 700, fontFamily: 'monospace', color: '#0D2B4E' }}>253654</td>
                <td style={{ padding: 12 }}>INFIELD ECO WATER SYSTEMS ENGINEERING</td>
                <td style={{ padding: 12, color: '#0369A1', fontWeight: 700 }}>0.00</td>
                <td style={{ padding: 12, textAlign: 'right' }}>
                  <Link href="/admin/customers/card" style={{ background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', padding: '6px 12px', borderRadius: 6, fontWeight: 700, textDecoration: 'none', fontSize: 12 }}>
                    Open Card
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
