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

  useEffect(() => {
    api.get('/documents/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1400, margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
        
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Dashboard</h1>
            <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>System Overview & Quick Actions</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/admin/documents" style={{ background: '#1E88E5', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>+ New Quote</Link>
            <Link href="/admin/documents" style={{ background: '#0D2B4E', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>+ New Poster</Link>
          </div>
        </div>

        {/* TOP ROW: Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20 }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active Jobs</div>
            <div style={{ fontSize: 42, fontWeight: 800, color: '#0D2B4E', lineHeight: 1, marginTop: 10 }}>28</div>
            <BarChart data={[8, 12, 9, 15, 11, 18, 14, 22, 28]} color="#0D2B4E" height={80} />
          </div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20 }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>Attendance</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <DonutChart percent={85} size={100} color="#0D2B4E" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Present 85%</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Absent 15%</div>
              </div>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20 }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Revenue</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', marginTop: 8, marginBottom: 4 }}>KSH 1,240,500</div>
            <LineChart data={[4, 8, 12, 9, 15, 18, 22, 26, 30]} color="#1E88E5" height={70} />
          </div>
        </div>

        {/* BOTTOM ROW: Tables & Poster */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0D2B4E', marginBottom: 16 }}>Recent Documents</h2>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ paddingBottom: 8 }}>Serial</th><th style={{ paddingBottom: 8 }}>Client</th><th style={{ paddingBottom: 8 }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentDocs?.length === 0 ? <tr><td colSpan={3} style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>No documents yet</td></tr> :
                 stats?.recentDocs?.map((d: any) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 0', fontWeight: 700 }}>{d.serialNo}</td>
                    <td>{d.clientName}</td>
                    <td style={{ fontWeight: 700 }}>KSH {Number(d.total || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Poster Quick Launch Box */}
          <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', borderRadius: 16, padding: 24, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 10px 0' }}>Poster Generator</h2>
            <p style={{ fontSize: 13, opacity: 0.9, marginBottom: 20 }}>Create professional promotional posters for your solar products.</p>
            <Link href="/admin/documents" style={{ background: '#fff', color: '#0ea5e9', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>Launch Generator</Link>
          </div>
        </div>

      </div>
    </Layout>
  );
}
