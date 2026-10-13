'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useState } from 'react';

export default function EmployeeLinksPage() {
  const [link, setLink] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const r = await api.post('/customers/link');
      setLink(r.data);
      setCopied(false);
    } catch (e: any) {
      const msg =
        e.response?.data?.error ||
        e.message ||
        'Failed to generate link';
      setError(`${msg} (status ${e.response?.status || 'network'})`);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (!link?.url) return;
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout requireEmployee>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0D2B4E', margin: 0 }}>
            Generate Customer Link
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
            Valid for 6 hours • Customer session lasts 6 hours
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(13,43,78,0.06)', border: '1px solid #F1F5F9' }}>
          <button
            onClick={generate}
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#94a3b8' : '#1E88E5',
              color: '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: loading ? 'wait' : 'pointer',
              boxShadow: '0 4px 12px rgba(30,136,229,0.25)',
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Generating…' : '🔗 Generate Customer Link'}
          </button>

          {error && (
            <div style={{ marginTop: '14px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '12px', borderRadius: '10px', fontSize: '13px' }}>
              <b>Error:</b> {error}
            </div>
          )}

          {link && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ background: '#E1F5FE', border: '1px solid #4FC3F7', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0D2B4E', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Customer Link
                </div>
                <div style={{ background: '#fff', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#0D2B4E', wordBreak: 'break-all' }}>
                  {link.url}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
                  Expires: {new Date(link.expiresAt).toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <button onClick={copy} style={{ background: '#1E88E5', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
                <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Shop with Infield: ' + link.url)}`, '_blank')} style={{ background: '#2E7D32', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
                  💬 WhatsApp
                </button>
                <button onClick={() => window.location.href = `mailto:?subject=Infield Shop Link&body=${link.url}`} style={{ background: '#4FC3F7', color: '#0D2B4E', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
                  ✉️ Email
                </button>
              </div>

              <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#92400E', marginTop: '16px' }}>
                ⚠️ Link valid for 6 hours. Session lasts 6 hours.
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}