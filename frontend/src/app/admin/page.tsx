'use client';
import Layout from '@/components/Layout';
import { api, UPLOADS_URL } from '@/lib/api';
import { connectAdminSocket } from '@/lib/socket';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [pending, setPending] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(u);

    api.get('/reports/summary').then((r) => setSummary(r.data)).catch(() => {});
    api.get('/products/admin/pending').then((r) => setPending(r.data)).catch(() => {});
    api.get('/payments').then((r) => setPayments(r.data)).catch(() => {});

    connectAdminSocket((event, data) => {
      setActivities((prev) =>
        [{ event, data, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 15)
      );
    });
  }, []);

  const approveProduct = async (id: string) => {
    await api.put(`/products/${id}/approve`);
    setPending((p) => p.filter((x) => x.id !== id));
  };
  const rejectProduct = async (id: string) => {
    await api.put(`/products/${id}/reject`);
    setPending((p) => p.filter((x) => x.id !== id));
  };
  const approvePayment = async (id: string) => {
    await api.put(`/payments/${id}/approve`);
    setPayments((p) =>
      p.map((x) => (x.id === id ? { ...x, status: 'APPROVED' } : x))
    );
  };

  const pendingPaymentCount = payments.filter((p) => p.status !== 'APPROVED').length;

  const stats = summary
    ? [
        { label: 'Users', value: summary.users, icon: '👥', color: '#1E88E5', href: '/admin/employees' },
        { label: 'Products', value: summary.products, icon: '📦', color: '#2E7D32', href: '/products' },
        { label: 'Quotations', value: summary.quotations, icon: '📄', color: '#7C3AED', href: '/quotations' },
        { label: 'Payments', value: summary.payments, icon: '💳', color: '#0891B2', href: '/admin/payments' },
        { label: 'Logs', value: summary.logs, icon: '📋', color: '#475569', href: '/admin/logs' },
        { label: 'Alerts', value: summary.alerts, icon: '🚨', color: '#DC2626', href: '/admin/logs' },
      ]
    : [];

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ============================================================
            WELCOME HEADER — centered
            ============================================================ */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 800,
              color: '#0D2B4E',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Welcome back, {user?.name || 'Admin'} 👋
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: '#64748b',
              marginTop: '8px',
              margin: 0,
            }}
          >
            Managing Infield Engineering operations in real-time
          </p>
        </div>

        {/* ============================================================
            STATS GRID — 6 columns responsive (inline styles, guaranteed)
            ============================================================ */}
        {summary && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '14px',
              marginBottom: '32px',
            }}
          >
            {stats.map((c) => (
              <a
                key={c.label}
                href={c.href}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #F1F5F9',
                  padding: '20px 16px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  boxShadow: '0 1px 3px rgba(13, 43, 78, 0.06)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(30, 136, 229, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#4FC3F7';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(13, 43, 78, 0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#F1F5F9';
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    margin: '0 auto 12px',
                    background: `${c.color}15`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                  }}
                >
                  {c.icon}
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color: c.color,
                    lineHeight: 1,
                    marginBottom: '6px',
                  }}
                >
                  {c.value}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {c.label}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* ============================================================
            QUICK ACTIONS
            ============================================================ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '32px',
          }}
        >
          {[
            { label: 'Manage Employees', icon: '👥', href: '/admin/employees', color: '#0D2B4E', text: '#fff' },
            { label: 'Manage Customers', icon: '🧑‍💼', href: '/admin/customers', color: '#1E88E5', text: '#fff' },
            { label: 'Profile & Password', icon: '⚙️', href: '/admin/profile', color: '#4FC3F7', text: '#0D2B4E' },
            { label: 'Approve Payments', icon: '💳', href: '/admin/payments', color: '#FFFFFF', text: '#1E88E5' },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              style={{
                background: action.color,
                color: action.text,
                padding: '14px 18px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '14px',
                textAlign: 'center',
                border: action.color === '#FFFFFF' ? '2px solid #1E88E5' : 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                transition: 'transform 0.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </a>
          ))}
        </div>

        {/* ============================================================
            TWO COLUMN — Pending Products + Pending Payments
            ============================================================ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          {/* Pending Products */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #F1F5F9',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(13, 43, 78, 0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#0D2B4E',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📦 Pending Products
              </h2>
              <span
                style={{
                  background: pending.length > 0 ? '#FEF3C7' : '#F1F5F9',
                  color: pending.length > 0 ? '#92400E' : '#64748b',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {pending.length}
              </span>
            </div>

            {pending.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '32px 0',
                  color: '#94a3b8',
                  fontSize: '13px',
                }}
              >
                ✅ No pending products
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}
              >
                {pending.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      background: '#F7FAFF',
                      border: '1px solid #F1F5F9',
                      borderRadius: '10px',
                      padding: '10px',
                    }}
                  >
                    {p.imageUrl ? (
                      <img
                        src={`${UPLOADS_URL}${p.imageUrl}`}
                        alt={p.name}
                        style={{
                          width: '44px',
                          height: '44px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          background: '#E2E8F0',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          flexShrink: 0,
                        }}
                      >
                        📦
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#0D2B4E',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {p.name}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#1E88E5',
                          fontWeight: 700,
                          marginTop: '2px',
                        }}
                      >
                        KES {Number(p.price).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => approveProduct(p.id)}
                        style={{
                          background: '#2E7D32',
                          color: '#fff',
                          border: 'none',
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                        title="Approve"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => rejectProduct(p.id)}
                        style={{
                          background: '#DC2626',
                          color: '#fff',
                          border: 'none',
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                        title="Reject"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Payments */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #F1F5F9',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(13, 43, 78, 0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#0D2B4E',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                💳 Pending Payments
              </h2>
              <span
                style={{
                  background: pendingPaymentCount > 0 ? '#FEF3C7' : '#F1F5F9',
                  color: pendingPaymentCount > 0 ? '#92400E' : '#64748b',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {pendingPaymentCount}
              </span>
            </div>

            {pendingPaymentCount === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '32px 0',
                  color: '#94a3b8',
                  fontSize: '13px',
                }}
              >
                ✅ No pending payments
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}
              >
                {payments
                  .filter((p) => p.status !== 'APPROVED')
                  .slice(0, 5)
                  .map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        background: '#F7FAFF',
                        border: '1px solid #F1F5F9',
                        borderRadius: '10px',
                        padding: '10px',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#0D2B4E',
                            fontFamily: 'monospace',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {p.reference}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#64748b',
                            marginTop: '2px',
                          }}
                        >
                          {p.customerPhone} • KES {Number(p.amount).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => approvePayment(p.id)}
                        style={{
                          background: '#2E7D32',
                          color: '#fff',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Approve
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
            LIVE ACTIVITY
            ============================================================ */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #F1F5F9',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(13, 43, 78, 0.06)',
          }}
        >
          <h2
            style={{
              fontSize: '16px',
              fontWeight: 800,
              color: '#0D2B4E',
              margin: 0,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                background: '#DC2626',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'pulse 1.5s infinite',
              }}
            />
            Live Activity
          </h2>

          {activities.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '32px 0',
                color: '#94a3b8',
                fontSize: '13px',
              }}
            >
              Waiting for live events…
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {activities.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: i < activities.length - 1 ? '1px solid #F1F5F9' : 'none',
                    fontSize: '13px',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      color: '#1E88E5',
                      fontFamily: 'monospace',
                    }}
                  >
                    {a.event}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '11px' }}>
                    {a.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}