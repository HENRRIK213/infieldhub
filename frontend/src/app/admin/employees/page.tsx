'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fetch real employees from backend
    api.get('/users?role=EMPLOYEE')
      .then(res => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleGenerateLink = () => {
    const token = Math.random().toString(36).substring(2, 10);
    setGeneratedLink(`https://infieldhub.com/employee/register/${token}`);
    setShowModal(true);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredEmployees = employees.filter(emp => 
    (emp.name && emp.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (emp.email && emp.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusStyle = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'ACTIVE': return { bg: '#DCFCE7', color: '#166534' };
      case 'PENDING': return { bg: '#FEF3C7', color: '#92400E' };
      case 'SUSPENDED': return { bg: '#FEE2E2', color: '#991B1B' };
      default: return { bg: '#F1F5F9', color: '#475569' };
    }
  };

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px', background: '#F1F5F9', minHeight: '100vh' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0D2B4E', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 32 }}>👥</span> Employee Management
            </h1>
            <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>Manage staff accounts, roles, and system access.</p>
          </div>
          <button onClick={handleGenerateLink} style={{ background: '#1E88E5', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 6px rgba(30,136,229,0.2)' }}>
            <span style={{ fontSize: 18 }}>+</span> Generate Registration Link
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 24 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Total Employees</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#0D2B4E', marginTop: 8 }}>{employees.length}</div>
          </div>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#2E7D32', textTransform: 'uppercase' }}>Active Accounts</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#2E7D32', marginTop: 8 }}>{employees.filter(e => e.status === 'ACTIVE').length}</div>
          </div>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>Pending Invites</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#B45309', marginTop: 8 }}>{employees.filter(e => e.status === 'PENDING').length}</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 24, display: 'flex', gap: 16 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
            <span style={{ position: 'absolute', left: 12, top: 12, fontSize: 16, color: '#94A3B8' }}>🔍</span>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Employee Name</th>
                <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Email Address</th>
                <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Role</th>
                <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center' }}>Loading employees...</td></tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 60, textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>📭</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0D2B4E', marginBottom: 8 }}>No Employees Found</h3>
                    <p style={{ color: '#64748B', fontSize: 14 }}>Click "Generate Registration Link" to invite your first team member.</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const statusStyle = getStatusStyle(emp.status);
                  return (
                    <tr key={emp.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 800, color: '#0D2B4E' }}>{emp.name || 'Pending User'}</td>
                      <td style={{ padding: '16px 24px', fontSize: 14, color: '#475569' }}>{emp.email}</td>
                      <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600 }}>{emp.role}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                          {emp.status || 'ACTIVE'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,43,78,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: 40, borderRadius: 16, width: '100%', maxWidth: 500, textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, background: '#E1F5FE', borderRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>🔗</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0D2B4E', marginBottom: 8 }}>Registration Link Created</h2>
            <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24 }}>Send this secure link to the new employee.</p>
            
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <input type="text" value={generatedLink} readOnly style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, background: '#F8FAFC', color: '#475569', outline: 'none' }} />
              <button onClick={copyToClipboard} style={{ background: copied ? '#2E7D32' : '#1E88E5', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer', minWidth: 100 }}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <button onClick={() => setShowModal(false)} style={{ width: '100%', padding: 16, background: '#F1F5F9', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', color: '#475569' }}>Close</button>
          </div>
        </div>
      )}
    </Layout>
  );
}
