'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const fetchLogs = () => {
    // Assuming there is an endpoint or fallback to empty
    api.get('/admin/logs?limit=100').then(r => setLogs(r.data)).catch(() => setLogs([]));
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this log?')) return;
    try {
      await api.delete(`/admin/logs/${id}`);
      setLogs(logs.filter(l => l.id !== id));
    } catch (e) {
      alert('Failed to delete log');
    }
  };

  const filtered = logs.filter(l => 
    (l.action || '').toLowerCase().includes(search.toLowerCase()) || 
    (l.details || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1400, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>System Activity Logs</h1>
            <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>Audit trail of all security and system events.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <input 
              type="text" placeholder="Search actions..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none' }}
            />
            <button style={{ background: '#0D2B4E', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Download CSV
            </button>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ color: '#64748b', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: 12 }}>Time</th>
              <th style={{ padding: 12 }}>User</th>
              <th style={{ padding: 12 }}>Action</th>
              <th style={{ padding: 12 }}>Details</th>
              <th style={{ padding: 12 }}>Severity</th>
              <th style={{ padding: 12, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No logs found.</td></tr> : 
             filtered.map((l, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: 12, color: '#64748b' }}>{new Date(l.createdAt).toLocaleString()}</td>
                <td style={{ padding: 12, fontWeight: 600 }}>{l.userId || 'System'}</td>
                <td style={{ padding: 12, fontWeight: 700, color: '#0D2B4E' }}>{l.action}</td>
                <td style={{ padding: 12, color: '#475569' }}>{l.details}</td>
                <td style={{ padding: 12 }}><span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>INFO</span></td>
                <td style={{ padding: 12, textAlign: 'right' }}>
                  <button onClick={() => handleDelete(l.id)} style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', padding: '6px 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
