'use client';
import Layout from '@/components/Layout';
import BarChart from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import LineChart from '@/components/charts/LineChart';

export default function AnalyticsPage() {
  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', marginBottom: 20 }}>Live System Analytics</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 20 }}>TOTAL REVENUE (KSH)</h3>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#0D2B4E', marginBottom: 20 }}>1,240,500</div>
            <LineChart data={[10, 20, 15, 40, 35, 60, 80, 70, 95]} color="#10b981" height={100} />
          </div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 20 }}>PRODUCT SALES</h3>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#0D2B4E', marginBottom: 20 }}>342</div>
            <BarChart data={[15, 20, 25, 22, 30, 28, 35, 40, 38, 45]} color="#1E88E5" height={100} />
          </div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 20 }}>PDF GENERATIONS</h3>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#0D2B4E', marginBottom: 20 }}>128</div>
            <BarChart data={[5, 10, 15, 12, 20, 18, 25, 30, 28, 35]} color="#8b5cf6" height={100} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, display: 'flex', alignItems: 'center', gap: 40 }}>
            <DonutChart percent={78} size={160} color="#1E88E5" />
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>78% Conversion Rate</h2>
              <p style={{ color: '#64748b', marginTop: 8, maxWidth: 400 }}>Based on real-time processing of quotes, payments, and customer conversions.</p>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, display: 'flex', alignItems: 'center', gap: 40 }}>
            <DonutChart percent={12} size={160} color="#ef4444" />
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>12 Blocked Attacks</h2>
              <p style={{ color: '#64748b', marginTop: 8, maxWidth: 400 }}>Security logs showing rejected API requests and unauthorized access attempts.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
