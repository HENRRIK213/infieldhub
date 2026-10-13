'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

type Step = 'verify-email' | 'verify-code' | 'profile' | 'done';

export default function EmployeeRegister() {
  const { token } = useParams();
  const router = useRouter();

  const [step, setStep] = useState<Step>('verify-email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkError, setLinkError] = useState('');

  useEffect(() => {
    api
      .get(`/invites/employee/verify/${token}`)
      .catch((e) => setLinkError(e.response?.data?.error || 'Invalid link'));
  }, [token]);

  const sendCode = async () => {
    if (!email) return setError('Enter your email');
    setError('');
    setLoading(true);
    try {
      await api.post('/invites/employee/send-code', { email, token });
      setStep('verify-code');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const goToProfile = () => {
    if (code.length !== 6) return setError('Enter the 6-digit code');
    setError('');
    setStep('profile');
  };

  const finish = async () => {
    setError('');
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 12) return setError('Password must be at least 12 characters');
    setLoading(true);
    try {
      await api.post('/invites/employee/register', { email, code, name, phone, password, token });
      setStep('done');
    } catch (err: any) {
      const details = err.response?.data?.details?.join(', ');
      setError(details || err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (linkError) {
    return (
      <div style={{ minHeight: '100vh', background: '#0D2B4E', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⛔</div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0D2B4E' }}>Link Invalid</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px', marginBottom: '20px' }}>{linkError}</p>
          <button onClick={() => router.push('/login')} style={{ background: '#0D2B4E', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#0D2B4E',
    background: '#F8FAFC',
    outline: 'none',
    marginBottom: '14px',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 700,
    color: '#0D2B4E',
    marginBottom: '6px',
    letterSpacing: '0.02em',
  };

  const primaryBtn = (disabled: boolean): React.CSSProperties => ({
    width: '100%',
    background: disabled ? '#94a3b8' : '#0D2B4E',
    color: '#fff',
    border: 'none',
    padding: '13px',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '14px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D2B4E 0%, #1565C0 55%, #1E88E5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '60px', height: '60px', margin: '0 auto 12px', background: '#fff', borderRadius: '14px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            <img src="/logo.png" alt="Infield" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e: any) => { e.target.style.display = 'none'; if (e.target.parentElement) e.target.parentElement.innerHTML = '<span style="color:#0D2B4E;font-size:22px;font-weight:900">iF</span>'; }} />
          </div>
          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, margin: 0 }}>Join InfieldHub</h1>
          <p style={{ color: '#4FC3F7', fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em', marginTop: '6px' }}>
            EMPLOYEE REGISTRATION
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: '18px', padding: '28px', boxShadow: '0 20px 50px rgba(13,43,78,0.35)' }}>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          {step === 'verify-email' && (
            <>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0D2B4E', margin: 0 }}>
                Enter your email
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', marginBottom: '20px' }}>
                We'll send a 6-digit code to confirm it's you.
              </p>
              <label style={labelStyle}>EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                autoFocus
                style={inputStyle}
              />
              <button onClick={sendCode} disabled={loading || !email} style={primaryBtn(loading || !email)}>
                {loading ? 'Sending…' : 'Send Verification Code'}
              </button>
            </>
          )}

          {step === 'verify-code' && (
            <>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0D2B4E', margin: 0 }}>
                Check your email
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', marginBottom: '20px' }}>
                Enter the 6-digit code sent to <b style={{ color: '#0D2B4E' }}>{email}</b>
              </p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                autoFocus
                style={{ ...inputStyle, fontSize: '26px', fontWeight: 800, letterSpacing: '0.5em', textAlign: 'center', fontFamily: 'monospace' }}
              />
              <button onClick={goToProfile} disabled={code.length !== 6} style={primaryBtn(code.length !== 6)}>
                Continue
              </button>
              <button onClick={() => { setStep('verify-email'); setCode(''); }} style={{ width: '100%', background: 'none', border: 'none', color: '#1E88E5', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', marginTop: '10px', fontFamily: 'inherit' }}>
                ← Change email
              </button>
            </>
          )}

          {step === 'profile' && (
            <>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0D2B4E', margin: 0 }}>
                Complete your profile
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', marginBottom: '20px' }}>
                Create your password and add your details.
              </p>
              <label style={labelStyle}>FULL NAME</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" style={inputStyle} />
              <label style={labelStyle}>PHONE</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="254XXXXXXXXX" style={inputStyle} />
              <label style={labelStyle}>PASSWORD</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create strong password" style={inputStyle} />
              <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '-10px', marginBottom: '14px' }}>
                12+ chars, uppercase, lowercase, number, special character.
              </p>
              <label style={labelStyle}>CONFIRM PASSWORD</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" style={{ ...inputStyle, marginBottom: '18px' }} />
              <button onClick={finish} disabled={loading} style={{ ...primaryBtn(false), background: loading ? '#94a3b8' : '#2E7D32' }}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </>
          )}

          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 16px', background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                ✅
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0D2B4E', marginBottom: '8px' }}>
                Welcome to InfieldHub!
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                Your account is ready. Log in with your email and password.
              </p>
              <button onClick={() => router.push('/login')} style={primaryBtn(false)}>
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}