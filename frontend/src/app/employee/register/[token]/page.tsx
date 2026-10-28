'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function EmployeeRegister() {
  const [isExpired, setIsExpired] = useState(false); // Simulate check for expired token

  if (isExpired) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D2B4E' }}>
        <div style={{ background: '#fff', padding: 40, borderRadius: 16, textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 50, color: '#EF4444', marginBottom: 20 }}>🚫</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', marginBottom: 10 }}>Link Invalid or Expired</h2>
          <p style={{ color: '#64748b' }}>This invitation link is no longer valid. Please contact your administrator to request a new link.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0D2B4E' }}>
      <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 20 }}>Join InfieldHub</h1>
      <div style={{ background: '#fff', padding: 40, borderRadius: 16, width: '100%', maxWidth: 400 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0D2B4E', marginBottom: 16 }}>Enter your email</h2>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>We'll send a 6-digit code to confirm it's you.</p>
        <input type="email" placeholder="you@gmail.com" style={{ width: '100%', padding: 12, border: '1px solid #cbd5e1', borderRadius: 8, marginBottom: 16 }} />
        <button style={{ width: '100%', padding: 14, background: '#94a3b8', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700 }}>Send Verification Code</button>
      </div>
    </div>
  );
}
