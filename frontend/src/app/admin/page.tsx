'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import BarChart from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import LineChart from '@/components/charts/LineChart';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(u);
    api.get('/reports/summary').then(r => setSummary(r.data)).catch(() => {});
  }, []);

  const activeJobs = summary?.products ?? 28;
  const users = summary?.users ?? 2;
  const attendance = Math.min(100, Math.round((users / Math.max(users, 8)) * 100));
  const revenue = summary?.payments ?? 45000;
  const monthlyGoal = Math.min(100, Math.round((revenue / 500000) * 100));

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gap: 20 }}>
        
        {/* TOP ROW: 3 Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {/* Active Jobs */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, boxShadow: '0 1px 3px rgba(13,43,78,0.05)' }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Jobs</div>
            <div style={{ fontSize: 42, fontWeight: 800, color: '#0D2B4E', lineHeight: 1, marginTop: 10 }}>{activeJobs}</div>
            <div style={{ marginTop: 14 }}><BarChart data={[8, 12, 9, 15, 11, 18, 14, 22, activeJobs]} color="#0D2B4E" height={80} /></div>
            <div style={{ fontSize: 12, color: '#16A34A', fontWeight: 700, marginTop: 8 }}>▲ 5% vs last week</div>
          </div>

          {/* Employee Attendance */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, boxShadow: '0 1px 3px rgba(13,43,78,0.05)' }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Employee Attendance</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <DonutChart percent={attendance} size={130} color="#0D2B4E" />
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

          {/* Recent Revenue */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, boxShadow: '0 1px 3px rgba(13,43,78,0.05)' }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent Revenue</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', marginTop: 8, marginBottom: 4 }}>KSH {revenue.toLocaleString()}</div>
            <LineChart data={[4, 8, 12, 9, 15, 18, 22, 26, 30]} color="#1E88E5" height={90} />
          </div>
        </div>

        {/* BOTTOM ROW: Project Activity & Monthly Goal */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)', gap: 20 }}>
          
          {/* Recent Project Activity */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, boxShadow: '0 1px 3px rgba(13,43,78,0.05)' }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0D2B4E', margin: 0, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent Project Activity</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ color: '#64748b', fontSize: 11, textTransform: 'uppercase', borderBottom: '1px solid #EEF2F6', textAlign: 'left' }}>
                  <th style={{ padding: '8px 4px' }}>Project ID</th>
                  <th style={{ padding: '8px 4px' }}>Customer Name</th>
                  <th style={{ padding: '8px 4px' }}>Status</th>
                  <th style={{ padding: '8px 4px' }}>Location</th>
                  <th style={{ padding: '8px 4px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: 10, fontWeight: 700 }}>Solar</td><td>Solar Installation: 10kW</td><td><span style={{ background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>Complete</span></td><td style={{ color: '#64748b' }}>Meru</td><td style={{ color: '#64748b' }}>08/16/2023</td></tr>
                <tr><td style={{ padding: 10, fontWeight: 700 }}>Electrical</td><td>Panel Upgrade - In Progress</td><td><span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>Pending</span></td><td style={{ color: '#64748b' }}>Nairobi</td><td style={{ color: '#64748b' }}>08/16/2023</td></tr>
                <tr><td style={{ padding: 10, fontWeight: 700 }}>Water</td><td>Pump Service - Scheduled</td><td><span style={{ background: '#FEE2E2', color: '#991B1B', padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>Issue</span></td><td style={{ color: '#64748b' }}>Nkanga</td><td style={{ color: '#64748b' }}>09/10/2023</td></tr>
              </tbody>
            </table>
          </div>

          {/* Monthly Goal */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, boxShadow: '0 1px 3px rgba(13,43,78,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0D2B4E', margin: 0, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Monthly Goal</h2>
            <DonutChart percent={monthlyGoal} size={140} color="#0D2B4E" />
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 12, textAlign: 'center' }}>KSH {revenue.toLocaleString()} of 500,000</div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
