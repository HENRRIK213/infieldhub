'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function CustomerRegister() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', { ...formData, token });
      router.push(`/customer/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D2B4E', padding: 20 }}>
      <div style={{ background: '#fff', padding: 40, borderRadius: 20, width: '100%', maxWidth: 450, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ width: 60, height: 60, background: '#E1F5FE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>
            🏢
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', marginBottom: 8 }}>Join InfieldHub</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Create your customer account to access the private catalog.</p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: 14, borderRadius: 8, marginBottom: 20, fontSize: 13, textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#0D2B4E', display: 'block', marginBottom: 6 }}>Full Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14, outline: 'none' }} placeholder="John Doe" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#0D2B4E', display: 'block', marginBottom: 6 }}>Email Address</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14, outline: 'none' }} placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#0D2B4E', display: 'block', marginBottom: 6 }}>Password</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14, outline: 'none' }} placeholder="••••••••" />
          </div>
          
          <button type="submit" disabled={loading} style={{ padding: 14, background: loading ? '#94a3b8' : '#1E88E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 10, transition: 'background 0.2s' }}>
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 24 }}>
          Already have an account? <span onClick={() => router.push('/login')} style={{ color: '#1E88E5', fontWeight: 600, cursor: 'pointer' }}>Sign in here</span>
        </p>
      </div>
    </div>
  );
}