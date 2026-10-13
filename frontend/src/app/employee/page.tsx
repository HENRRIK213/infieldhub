'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [productCount, setProductCount] = useState(0);
  const [quoteCount, setQuoteCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(u);
    api.get('/products').then((r) => setProductCount(r.data.length)).catch(() => {});
    api.get('/quotations').then((r) => setQuoteCount(r.data.length)).catch(() => {});
    api.get('/logs?limit=5').then((r) => setRecentActivity(r.data?.logs?.slice(0, 5) || [])).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const quickActions = [
    {
      icon: '🔗',
      title: 'Generate Customer Link',
      desc: 'Create a 24-hour shopping link',
      color: '#1E88E5',
      bg: '#E1F5FE',
      href: '/employee/links',
    },
    {
      icon: '🛍️',
      title: 'Browse Products',
      desc: 'View the full product catalog',
      color: '#2E7D32',
      bg: '#DCFCE7',
      href: '/products',
    },
    {
      icon: '✍️',
      title: 'Create Quotation',
      desc: 'Build a professional quotation',
      color: '#7C3AED',
      bg: '#EDE9FE',
      href: '/quotations',
    },
    {
      icon: '⚙️',
      title: 'My Profile',
      desc: 'Update password and details',
      color: '#0D2B4E',
      bg: '#E2E8F0',
      href: '/admin/profile',
    },
  ];

  return (
    <Layout requireEmployee>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* ============================================================
            HERO HEADER
            ============================================================ */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0D2B4E 0%, #1E88E5 100%)',
            borderRadius: '20px',
            padding: '32px 36px',
            color: '#FFFFFF',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(13, 43, 78, 0.15)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(79,195,247,0.25) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-60px',
              left: '30%',
              width: '250px',
              height: '250px',
              background: 'radial-gradient(circle, rgba(79,195,247,0.15) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p
              style={{
                fontSize: '13px',
                color: '#4FC3F7',
                fontWeight: 700,
                letterSpacing: '0.1em',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              {greeting}
            </p>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 800,
                margin: '8px 0 0',
                letterSpacing: '-0.02em',
              }}
            >
              {user?.name || 'Employee'} 👋
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.75)',
                marginTop: '6px',
                margin: 0,
              }}
            >
              Welcome to your InfieldHub workspace
            </p>
          </div>
        </div>

        {/* ============================================================
            STATS — 2 CARD GRID
            ============================================================ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          {/* Products Stat */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #F1F5F9',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(13, 43, 78, 0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(30, 136, 229, 0.12)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(13, 43, 78, 0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                background: '#E1F5FE',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                flexShrink: 0,
              }}
            >
              📦
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '11px',
                  color: '#64748b',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Products Available
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#1E88E5',
                  lineHeight: 1,
                }}
              >
                {productCount}
              </div>
            </div>
          </div>

          {/* Quotations Stat */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #F1F5F9',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(13, 43, 78, 0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.12)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(13, 43, 78, 0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                background: '#EDE9FE',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                flexShrink: 0,
              }}
            >
              📄
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '11px',
                  color: '#64748b',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Your Quotations
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#7C3AED',
                  lineHeight: 1,
                }}
              >
                {quoteCount}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            QUICK ACTIONS HEADER
            ============================================================ */}
        <div style={{ marginBottom: '16px' }}>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#0D2B4E',
              margin: 0,
            }}
          >
            Quick Actions
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: '#64748b',
              marginTop: '4px',
              margin: 0,
            }}
          >
            Common tasks you can perform
          </p>
        </div>

        {/* ============================================================
            QUICK ACTIONS — 2×2 GRID
            ============================================================ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {quickActions.map((a) => (
            <div
              key={a.href}
              onClick={() => router.push(a.href)}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #F1F5F9',
                padding: '24px',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(13, 43, 78, 0.06)',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                textAlign: 'left',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 24px ${a.color}22`;
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = a.color;
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
                  background: a.bg,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0,
                }}
              >
                {a.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    color: '#0D2B4E',
                    marginBottom: '4px',
                  }}
                >
                  {a.title}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#64748b',
                    lineHeight: 1.4,
                  }}
                >
                  {a.desc}
                </div>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: a.color,
                  fontWeight: 700,
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Go to page →
              </div>
            </div>
          ))}
        </div>

        {/* ============================================================
            RECENT ACTIVITY
            ============================================================ */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #F1F5F9',
            padding: '24px',
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
            <div>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#0D2B4E',
                  margin: 0,
                }}
              >
                Your Recent Activity
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  color: '#64748b',
                  marginTop: '4px',
                  margin: 0,
                }}
              >
                Last 5 actions in the system
              </p>
            </div>
            <div
              style={{
                width: '10px',
                height: '10px',
                background: '#2E7D32',
                borderRadius: '50%',
                boxShadow: '0 0 0 4px rgba(46, 125, 50, 0.2)',
              }}
            />
          </div>

          {recentActivity.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '32px 0',
                color: '#94a3b8',
                fontSize: '13px',
              }}
            >
              No activity yet. Start by generating a customer link or browsing products.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentActivity.map((log, i) => (
                <div
                  key={log.id || i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom:
                      i < recentActivity.length - 1 ? '1px solid #F1F5F9' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        background: '#F0F7FF',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                      }}
                    >
                      {log.action?.includes('LOGIN') ? '🔓' : log.action?.includes('QUOTE') ? '📄' : '📋'}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#0D2B4E',
                          fontFamily: 'monospace',
                        }}
                      >
                        {log.action}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#64748b',
                          marginTop: '2px',
                        }}
                      >
                        {log.details || '—'}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#94a3b8',
                      whiteSpace: 'nowrap',
                      marginLeft: '8px',
                    }}
                  >
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}