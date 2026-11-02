'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

type RegistrationForm = {
  email: string;
  code: string;
  name: string;
  phone: string;
  password: string;
};

export default function EmployeeRegister() {
  const params = useParams<{ token: string }>();
  const token = typeof params.token === 'string' ? params.token : '';
  const [form, setForm] = useState<RegistrationForm>({
    email: '',
    code: '',
    name: '',
    phone: '',
    password: '',
  });
  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get(`/invites/employee/verify/${encodeURIComponent(token)}`)
      .then(() => {
        if (active) setValid(true);
      })
      .catch(() => {
        if (active) setValid(false);
      })
      .finally(() => {
        if (active) setValidating(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  const update = (key: keyof RegistrationForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const sendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setError('');
    try {
      await api.post('/invites/employee/send-code', { email: form.email, token });
      setCodeSent(true);
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || 'Could not send the verification code. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const register = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegistering(true);
    setError('');
    try {
      await api.post('/invites/employee/register', { ...form, token });
      setComplete(true);
    } catch (requestError: any) {
      const details = requestError.response?.data?.details;
      setError(Array.isArray(details)
        ? details.join('. ')
        : requestError.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const cardStyle = {
    background: '#fff',
    padding: 36,
    borderRadius: 16,
    width: '100%',
    maxWidth: 460,
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  };
  const inputStyle = {
    width: '100%',
    padding: 12,
    border: '1px solid #cbd5e1',
    borderRadius: 8,
  };

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0D2B4E',
      padding: 20,
    }}>
      <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 20 }}>Join InfieldHub</h1>
      <section style={cardStyle}>
        {validating ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Checking your invitation…</p>
        ) : !valid ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, color: '#dc2626', marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0D2B4E', marginBottom: 10 }}>
              Link Invalid or Expired
            </h2>
            <p style={{ color: '#64748b' }}>
              This invitation link is no longer valid. Please contact your administrator to request a new link.
            </p>
          </div>
        ) : complete ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>✓</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0D2B4E', marginBottom: 10 }}>
              Registration complete
            </h2>
            <p style={{ color: '#64748b', marginBottom: 20 }}>
              Your employee account is ready. Sign in with your email and password.
            </p>
            <Link href="/login" style={{
              display: 'block',
              padding: 13,
              background: '#1E88E5',
              color: '#fff',
              borderRadius: 8,
              fontWeight: 700,
              textDecoration: 'none',
            }}>
              Go to sign in
            </Link>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 21, fontWeight: 800, color: '#0D2B4E', marginBottom: 8 }}>
              Complete your employee registration
            </h2>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
              Verify your email, then create your employee account.
            </p>
            {error && (
              <div role="alert" style={{
                background: '#FEF2F2',
                color: '#B91C1C',
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
                fontSize: 13,
              }}>
                {error}
              </div>
            )}
            {!codeSent ? (
              <form onSubmit={sendCode} style={{ display: 'grid', gap: 14 }}>
                <label style={{ display: 'grid', gap: 6, color: '#334155', fontSize: 14, fontWeight: 600 }}>
                  Work email
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(event) => update('email', event.target.value)}
                    style={inputStyle}
                  />
                </label>
                <button type="submit" disabled={sending} style={{
                  padding: 14,
                  background: sending ? '#94a3b8' : '#1E88E5',
                  color: '#fff',
                  border: 0,
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: sending ? 'wait' : 'pointer',
                }}>
                  {sending ? 'Sending code…' : 'Send verification code'}
                </button>
              </form>
            ) : (
              <form onSubmit={register} style={{ display: 'grid', gap: 13 }}>
                <p style={{ color: '#475569', fontSize: 14 }}>
                  Enter the 6-digit code sent to <strong>{form.email}</strong>.
                </p>
                <label style={{ display: 'grid', gap: 6, color: '#334155', fontSize: 14, fontWeight: 600 }}>
                  Verification code
                  <input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    value={form.code}
                    onChange={(event) => update('code', event.target.value.replace(/\D/g, ''))}
                    style={{ ...inputStyle, letterSpacing: 6, textAlign: 'center', fontSize: 20 }}
                  />
                </label>
                <label style={{ display: 'grid', gap: 6, color: '#334155', fontSize: 14, fontWeight: 600 }}>
                  Full name
                  <input required value={form.name} onChange={(event) => update('name', event.target.value)} style={inputStyle} />
                </label>
                <label style={{ display: 'grid', gap: 6, color: '#334155', fontSize: 14, fontWeight: 600 }}>
                  Phone number <span style={{ fontWeight: 400, color: '#64748b' }}>(optional)</span>
                  <input type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} style={inputStyle} />
                </label>
                <label style={{ display: 'grid', gap: 6, color: '#334155', fontSize: 14, fontWeight: 600 }}>
                  Password
                  <input
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    required
                    value={form.password}
                    onChange={(event) => update('password', event.target.value)}
                    style={inputStyle}
                  />
                </label>
                <p style={{ color: '#64748b', fontSize: 12, marginTop: -7 }}>
                  Use at least 12 characters with uppercase and lowercase letters, a number, and a symbol.
                </p>
                <button type="submit" disabled={registering} style={{
                  padding: 14,
                  background: registering ? '#94a3b8' : '#1E88E5',
                  color: '#fff',
                  border: 0,
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: registering ? 'wait' : 'pointer',
                }}>
                  {registering ? 'Creating account…' : 'Create employee account'}
                </button>
                <button type="button" onClick={() => { setCodeSent(false); setError(''); }} style={{
                  background: 'transparent',
                  border: 0,
                  color: '#1E88E5',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}>
                  Use a different email
                </button>
              </form>
            )}
          </>
        )}
      </section>
    </main>
  );
}
