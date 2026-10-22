'use client';
import Layout from '@/components/Layout';
import { useState } from 'react';

export default function LinkGeneratorPage() {
  const [customerLink, setCustomerLink] = useState('');
  const [employeeLink, setEmployeeLink] = useState('');
  const [copied, setCopied] = useState('');

  const generateLink = (type: 'customer' | 'employee') => {
    const id = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    const link = `https://infieldhub.vercel.app/${type}/register/${id}`;
    if (type === 'customer') setCustomerLink(link);
    else setEmployeeLink(link);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleWhatsApp = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    window.open(`https://wa.me/254701243548?text=${encodeURIComponent(message + '\n\n' + text)}`, '_blank');
  };

  const handleEmail = (text: string, subject: string) => {
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Here is your link: ' + text)}`;
  };

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 30 }}>
        
        {/* CUSTOMER LINK */}
        <div style={{ background: '#fff', padding: 30, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0D2B4E', marginBottom: 16 }}>Customer Shopping Link</h2>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>Generate a link for customers to shop and view your products.</p>
          
          <button onClick={() => generateLink('customer')} style={{ width: '100%', background: '#1E88E5', color: '#fff', padding: 14, borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer', marginBottom: 20 }}>
            Generate Customer Link
          </button>

          {customerLink && (
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Customer Link</div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <input readOnly value={customerLink} style={{ flex: 1, padding: 10, border: '1px solid #cbd5e1', borderRadius: 6, background: '#fff', fontSize: 13 }} />
                <button onClick={() => handleCopy(customerLink, 'customer')} style={{ background: copied === 'customer' ? '#10b981' : '#0D2B4E', color: '#fff', padding: '0 20px', borderRadius: 6, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                  {copied === 'customer' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => handleWhatsApp(customerLink, 'Here is your shopping link:')} style={{ flex: 1, background: '#25D366', color: '#fff', padding: 10, borderRadius: 6, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                  WhatsApp
                </button>
                <button onClick={() => handleEmail(customerLink, 'Your Shopping Link')} style={{ flex: 1, background: '#38bdf8', color: '#fff', padding: 10, borderRadius: 6, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                  Email
                </button>
              </div>
            </div>
          )}
        </div>

        {/* EMPLOYEE LINK */}
        <div style={{ background: '#fff', padding: 30, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0D2B4E', marginBottom: 16 }}>Employee Registration Link</h2>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>Generate a link for new employees to register.</p>
          
          <button onClick={() => generateLink('employee')} style={{ width: '100%', background: '#0D2B4E', color: '#fff', padding: 14, borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer', marginBottom: 20 }}>
            Generate Employee Link
          </button>

          {employeeLink && (
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Employee Link</div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <input readOnly value={employeeLink} style={{ flex: 1, padding: 10, border: '1px solid #cbd5e1', borderRadius: 6, background: '#fff', fontSize: 13 }} />
                <button onClick={() => handleCopy(employeeLink, 'employee')} style={{ background: copied === 'employee' ? '#10b981' : '#0D2B4E', color: '#fff', padding: '0 20px', borderRadius: 6, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                  {copied === 'employee' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => handleWhatsApp(employeeLink, 'Here is your employee registration link:')} style={{ flex: 1, background: '#25D366', color: '#fff', padding: 10, borderRadius: 6, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                  WhatsApp
                </button>
                <button onClick={() => handleEmail(employeeLink, 'Employee Registration')} style={{ flex: 1, background: '#38bdf8', color: '#fff', padding: 10, borderRadius: 6, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                  Email
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
