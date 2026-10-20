'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(u);
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', msg: 'New passwords do not match.' });
      return;
    }
    setLoading(true);
    setStatus({ type: '', msg: '' });
    try {
      // Assuming standard endpoint for password change
      await api.put('/auth/change-password', { currentPassword, newPassword });
      setStatus({ type: 'success', msg: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.response?.data?.error || 'Failed to update password.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>My Profile</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>Manage your account settings and security preferences.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          
          {/* LEFT COLUMN: Profile Card */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', height: 'fit-content' }}>
            
            {/* Top Header Background */}
            <div style={{ height: 100, background: 'linear-gradient(135deg, #0D2B4E 0%, #1E88E5 100%)' }}></div>
            
            <div style={{ padding: '0 24px 32px', position: 'relative' }}>
              {/* Avatar */}
              <div style={{ 
                width: 80, height: 80, borderRadius: '50%', background: '#fff', border: '4px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: '#1E88E5',
                marginTop: -40, boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>

              <div style={{ marginTop: 16 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>{user.name || 'Super Admin'}</h2>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                  <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{user.role}</span>
                  <span style={{ background: '#DCFCE7', color: '#166534', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>● Active</span>
                </div>
              </div>

              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</div>
                  <div style={{ fontSize: 14, color: '#0D2B4E', fontWeight: 600, marginTop: 2 }}>{user.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Type</div>
                  <div style={{ fontSize: 14, color: '#0D2B4E', fontWeight: 600, marginTop: 2 }}>Administrator</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>User ID</div>
                  <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace', marginTop: 2 }}>{user.id || 'cmv3vibp0000an1ywoijvf1p'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Security / Password */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <span style={{ fontSize: 24 }}>🔒</span>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Change Password</h2>
            </div>

            {status.msg && (
              <div style={{ padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 13, fontWeight: 600, background: status.type === 'success' ? '#DCFCE7' : '#FEE2E2', color: status.type === 'success' ? '#166534' : '#991B1B' }}>
                {status.msg}
              </div>
            )}

            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0D2B4E', marginBottom: 8 }}>Current Password</label>
                <input 
                  type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'border 0.2s' }} 
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0D2B4E', marginBottom: 8 }}>New Password</label>
                <input 
                  type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'border 0.2s' }} 
                  placeholder="Create a strong password"
                />
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>Must be 12+ characters, include uppercase, lowercase, number, and special character.</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0D2B4E', marginBottom: 8 }}>Confirm New Password</label>
                <input 
                  type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'border 0.2s' }} 
                  placeholder="Confirm new password"
                />
              </div>

              <div style={{ marginTop: 10 }}>
                <button type="submit" disabled={loading} style={{ 
                  background: '#1E88E5', color: '#fff', border: 'none', padding: '14px 24px', borderRadius: 8, 
                  fontSize: 14, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', boxShadow: '0 4px 10px rgba(30,136,229,0.3)',
                  transition: 'background 0.2s'
                }}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </Layout>
  );
}
