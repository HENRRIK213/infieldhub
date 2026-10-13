'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [inviteLink, setInviteLink] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = () =>
    api.get('/users/employees').then((r) => setEmployees(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const generateInvite = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/invites/employee/generate');
      setInviteLink(res.data);
      setCopied(false);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to generate link');
    } finally {
      setGenerating(false);
    }
  };

  const copyLink = () => {
    if (!inviteLink?.url) return;
    navigator.clipboard.writeText(inviteLink.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    if (!inviteLink?.url) return;
    window.open(`https://wa.me/?text=Register as an Infield employee: ${inviteLink.url}`, '_blank');
  };

  const shareEmail = () => {
    if (!inviteLink?.url) return;
    window.location.href = `mailto:?subject=InfieldHub Employee Invitation&body=Register here: ${inviteLink.url}`;
  };

  const remove = async (id: string, email: string) => {
    if (!confirm(`Remove employee ${email}?`)) return;
    await api.delete(`/users/${id}`);
    load();
  };

  const forceLogout = async (id: string) => {
    await api.post(`/users/${id}/force-logout`);
    alert('Employee session ended.');
  };

  const toggle = async (id: string) => {
    await api.put(`/users/${id}/toggle`);
    load();
  };

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0D2B4E', margin: 0 }}>
            Employee Management
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
            Generate a registration link and send it to new employees.
          </p>
        </div>

        {/* Generate button */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button
            onClick={generateInvite}
            disabled={generating}
            style={{
              background: '#4FC3F7',
              color: '#0D2B4E',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: generating ? 'wait' : 'pointer',
              boxShadow: '0 4px 12px rgba(79, 195, 247, 0.35)',
            }}
          >
            {generating ? 'Generating…' : '🔗 Generate Employee Registration Link'}
          </button>
        </div>

        {/* Invite link display */}
        {inviteLink && (
          <div
            style={{
              background: '#E1F5FE',
              border: '2px solid #4FC3F7',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0D2B4E', margin: 0 }}>
                📋 Employee Registration Link
              </h2>
              <button
                onClick={() => setInviteLink(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#0D2B4E', marginBottom: '12px' }}>
              Share this link with the new employee. It expires in <b>7 days</b>.
              When they open it, they will register and receive a code on their email.
            </p>

            <div
              style={{
                background: '#fff',
                border: '1px solid #4FC3F7',
                borderRadius: '8px',
                padding: '12px',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#0D2B4E',
                wordBreak: 'break-all',
                marginBottom: '12px',
              }}
            >
              {inviteLink.url}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                onClick={copyLink}
                style={{
                  background: '#1E88E5',
                  color: '#fff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
              <button
                onClick={shareWhatsApp}
                style={{
                  background: '#2E7D32',
                  color: '#fff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                💬 WhatsApp
              </button>
              <button
                onClick={shareEmail}
                style={{
                  background: '#4FC3F7',
                  color: '#0D2B4E',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                ✉️ Email
              </button>
            </div>
          </div>
        )}

        {/* Employee list */}
        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #F1F5F9',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(13, 43, 78, 0.06)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#0D2B4E', color: '#fff' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Email</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0D2B4E' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>{u.name || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        background: u.active ? '#DCFCE7' : '#FEE2E2',
                        color: u.active ? '#166534' : '#991B1B',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {u.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => forceLogout(u.id)}
                      style={{
                        background: '#0D2B4E',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      Logout
                    </button>
                    <button
                      onClick={() => toggle(u.id)}
                      style={{
                        background: '#F9A825',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      {u.active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => remove(u.id, u.email)}
                      style={{
                        background: '#DC2626',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    No employees yet. Generate a registration link above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}