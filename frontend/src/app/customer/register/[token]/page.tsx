'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function CustomerPortal() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false); // Toggle between Login and Register
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // LOGIN FLOW
        const res = await api.post('/auth/login', { email: formData.email, password: formData.password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        router.push('/products');
      } else {
        // REGISTRATION FLOW
        await api.post('/auth/register', formData);
        router.push(`/customer/verify?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: 20 }}>
      <div style={{ background: '#fff', padding: 40, borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: 450 }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
          <div style={{ width: 60, height: 60, background: '#E1F5FE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>
            👤
          </div>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', marginBottom: 10, textAlign: 'center' }}>
          {isLogin ? 'Welcome Back' : 'Create Customer Account'}
        </h1>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: 20, fontSize: 14 }}>
          {isLogin ? 'Sign in to access your private catalog.' : 'Register to view our premium products.'}
        </p>

        {error && <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 13, textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isLogin && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#0D2B4E' }}>Full Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid #cbd5e1', borderRadius: 8, marginTop: 4 }} />
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#0D2B4E' }}>Email Address</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid #cbd5e1', borderRadius: 8, marginTop: 4 }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#0D2B4E' }}>Password</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid #cbd5e1', borderRadius: 8, marginTop: 4 }} />
          </div>
          
          <button type="submit" disabled={loading} style={{ padding: 14, background: '#1E88E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', marginTop: 10 }}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ background: 'none', border: 'none', color: '#1E88E5', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            {isLogin ? "Don't have an account? Register here" : "Already have an account? Sign in"}
          </button>
        </div>

      </div>
    </div>
  );
}
