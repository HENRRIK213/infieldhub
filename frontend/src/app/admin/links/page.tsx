'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useState } from 'react';

export default function AdminLinksPage() {
  const [customer, setCustomer] = useState<any>(null);
  const [employee, setEmployee] = useState<any>(null);
  const [loadingC, setLoadingC] = useState(false);
  const [loadingE, setLoadingE] = useState(false);
  const [errorC, setErrorC] = useState('');
  const [errorE, setErrorE] = useState('');
  const [copiedC, setCopiedC] = useState(false);
  const [copiedE, setCopiedE] = useState(false);

  const generateCustomer = async () => {
    setLoadingC(true);
    setErrorC('');
    try {
      const r = await api.post('/customers/link');
      setCustomer(r.data);
      setCopiedC(false);
    } catch (e: any) {
      const msg =
        e.response?.data?.error ||
        e.message ||
        'Failed to generate customer link';
      setErrorC(`${msg} (status ${e.response?.status || 'network'})`);
    } finally {
      setLoadingC(false);
    }
  };

  const generateEmployee = async () => {
    setLoadingE(true);
    setErrorE('');
    try {
      const r = await api.post('/invites/employee/generate');
      setEmployee(r.data);
      setCopiedE(false);
    } catch (e: any) {
      const msg =
        e.response?.data?.error ||
        e.message ||
        'Failed to generate employee link';
      setErrorE(`${msg} (status ${e.response?.status || 'network'})`);
    } finally {
      setLoadingE(false);
    }
  };

  const copy = (url: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0D2B4E', margin: 0 }}>
            Link Generator
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
            Generate links for customers and new employees
          </p>
        </div>

        {/* ============ CUSTOMER LINK ============ */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '2px solid #1E88E5', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 16px rgba(30,136,229,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: '#E1F5FE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              🛒
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0D2B4E', margin: 0 }}>
                Customer Shopping Link
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, marginTop: '2px' }}>
                Valid for 6 hours • Session lasts 6 hours
              </p>
            </div>
          </div>

          <button
            onClick={generateCustomer}
            disabled={loadingC}
            style={{
              width: '100%',
              background: loadingC ? '#94a3b8' : '#1E88E5',
              color: '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: loadingC ? 'wait' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {loadingC ? 'Generating…' : '🔗 Generate Customer Link'}
          </button>

          {errorC && (
            <div style={{ marginTop: '12px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '12px', borderRadius: '10px', fontSize: '13px' }}>
              <b>Error:</b> {errorC}
            </div>
          )}

          {customer && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ background: '#F0F7FF', border: '1px solid #4FC3F7', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0D2B4E', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Customer Link
                </div>
                <div style={{ background: '#fff', padding: '10px', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace', color: '#0D2B4E', wordBreak: 'break-all' }}>
                  {customer.url}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                  Expires: {new Date(customer.expiresAt).toLocaleString()}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <button onClick={() => copy(customer.url, setCopiedC)} style={{ background: '#1E88E5', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {copiedC ? '✓ Copied' : '📋 Copy'}
                </button>
                <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Shop with Infield: ' + customer.url)}`, '_blank')} style={{ background: '#2E7D32', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  💬 WhatsApp
                </button>
                <button onClick={() => window.location.href = `mailto:?subject=Infield Shop Link&body=${customer.url}`} style={{ background: '#4FC3F7', color: '#0D2B4E', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✉️ Email
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ============ EMPLOYEE LINK ============ */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '2px solid #4FC3F7', padding: '24px', boxShadow: '0 4px 16px rgba(79,195,247,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: '#E1F5FE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              👥
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0D2B4E', margin: 0 }}>
                Employee Registration Link
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, marginTop: '2px' }}>
                Valid for 7 days • Employee registers with email code
              </p>
            </div>
          </div>

          <button
            onClick={generateEmployee}
            disabled={loadingE}
            style={{
              width: '100%',
              background: loadingE ? '#94a3b8' : '#0D2B4E',
              color: '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: loadingE ? 'wait' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {loadingE ? 'Generating…' : '🔗 Generate Employee Link'}
          </button>

          {errorE && (
            <div style={{ marginTop: '12px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '12px', borderRadius: '10px', fontSize: '13px' }}>
              <b>Error:</b> {errorE}
            </div>
          )}

          {employee && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ background: '#F0F7FF', border: '1px solid #4FC3F7', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0D2B4E', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Employee Link
                </div>
                <div style={{ background: '#fff', padding: '10px', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace', color: '#0D2B4E', wordBreak: 'break-all' }}>
                  {employee.url}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                  Expires: {new Date(employee.expiresAt).toLocaleString()}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <button onClick={() => copy(employee.url, setCopiedE)} style={{ background: '#1E88E5', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {copiedE ? '✓ Copied' : '📋 Copy'}
                </button>
                <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Join InfieldHub as employee: ' + employee.url)}`, '_blank')} style={{ background: '#2E7D32', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  💬 WhatsApp
                </button>
                <button onClick={() => window.location.href = `mailto:?subject=InfieldHub Employee Invitation&body=${employee.url}`} style={{ background: '#4FC3F7', color: '#0D2B4E', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✉️ Email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}