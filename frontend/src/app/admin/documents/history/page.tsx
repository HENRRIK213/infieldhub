'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function HistoryPage() {
  const [docs, setDocs] = useState<any[]>([]);

  const fetchDocs = () => {
    api.get('/documents').then(r => setDocs(r.data)).catch(() => {});
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocs(docs.filter(d => d.id !== id));
    } catch (e) {
      alert('Failed to delete document');
    }
  };

  const handleDownload = (d: any) => {
    // In a real app, this would call the backend to generate the exact PDF.
    // For now, it downloads a text representation or triggers a print.
    alert(`Downloading Document: ${d.serialNo}\nType: ${d.type}\nAmount: ${d.total}`);
  };

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1200, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', marginBottom: 20 }}>All Quotations, Invoices & Reports</h1>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ color: '#64748b', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: 12 }}>Serial No</th>
              <th style={{ padding: 12 }}>Type</th>
              <th style={{ padding: 12 }}>Client Name</th>
              <th style={{ padding: 12 }}>Date</th>
              <th style={{ padding: 12 }}>Total (KSH)</th>
              <th style={{ padding: 12 }}>Status</th>
              <th style={{ padding: 12, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.length === 0 ? <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No documents generated yet.</td></tr> : 
             docs.map((d, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: 12, fontWeight: 700, fontFamily: 'monospace', color: '#0D2B4E' }}>{d.serialNo}</td>
                <td style={{ padding: 12 }}><span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>{d.type}</span></td>
                <td style={{ padding: 12 }}>{d.clientName || 'Walk-in'}</td>
                <td style={{ padding: 12, color: '#64748b' }}>{new Date(d.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: 12, fontWeight: 700 }}>{Number(d.total || 0).toLocaleString()}</td>
                <td style={{ padding: 12 }}>
                  <span style={{ background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>{d.status}</span>
                </td>
                <td style={{ padding: 12, textAlign: 'right', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => handleDownload(d)} style={{ background: '#1E88E5', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>PDF</button>
                  <button onClick={() => handleDelete(d.id)} style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', padding: '6px 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
