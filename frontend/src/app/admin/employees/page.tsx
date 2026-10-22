'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/admin/employees').then(r => setEmployees(r.data)).catch(() => {});
  }, []);

  const generateLink = () => {
    const id = Math.random().toString(36).substring(2, 10);
    setGeneratedLink(`https://infieldhub.vercel.app/employee/register/${id}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    navigator.clipboard.writeText(generatedLink);
    window.open(`https://wa.me/254701243548?text=${encodeURIComponent('Here is your employee registration link:\n\n' + generatedLink)}`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = `mailto:?subject=Employee Registration Link&body=${encodeURIComponent('Click this link to register:\n\n' + generatedLink)}`;
  };

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Employee Management</h1>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Generate a registration link and send it to new employees.</p>
          
          <button onClick={generateLink} style={{ marginTop: 20, background: '#1E88E5', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            Generate Employee Registration Link
          </button>
        </div>

        {generatedLink && (
          <div style={{ background: '#E0F2FE', border: '1px solid #7DD3FC', padding: 20, borderRadius: 12, marginBottom: 30 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0369A1', margin: 0 }}>Employee Registration Link</h3>
              <button onClick={() => setGeneratedLink('')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#0369A1' }}>×</button>
            </div>
            <p style={{ fontSize: 13, color: '#0C4A6E', marginBottom: 16 }}>Share this link with the new employee. It expires in 7 days.</p>
            
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <input readOnly value={generatedLink} style={{ flex: 1, padding: 12, border: '1px solid #BAE6FD', borderRadius: 8, background: '#fff', fontSize: 13 }} />
            </div>
            
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleCopy} style={{ flex: 1, background: copied ? '#10b981' : '#0D2B4E', color: '#fff', padding: 12, borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={handleWhatsApp} style={{ flex: 1, background: '#25D366', color: '#fff', padding: 12, borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                WhatsApp
              </button>
              <button onClick={handleEmail} style={{ flex: 1, background: '#38bdf8', color: '#fff', padding: 12, borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                Email
              </button>
            </div>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#0D2B4E', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: 16 }}>Email</th>
                <th style={{ padding: 16 }}>Name</th>
                <th style={{ padding: 16 }}>Status</th>
                <th style={{ padding: 16, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>No employees found.</td></tr>
              ) : employees.map((e, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: 16, fontWeight: 600 }}>{e.email}</td>
                  <td style={{ padding: 16 }}>{e.name}</td>
                  <td style={{ padding: 16 }}>
                    <span style={{ background: e.active ? '#DCFCE7' : '#FEE2E2', color: e.active ? '#166534' : '#991B1B', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                      {e.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ padding: 16, textAlign: 'right', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button style={{ background: '#0D2B4E', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>Logout</button>
                    <button style={{ background: '#F59E0B', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>Disable</button>
                    <button style={{ background: '#DC2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
