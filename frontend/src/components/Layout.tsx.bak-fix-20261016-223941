'use client';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Layout({
  children,
  requireAdmin = false,
  requireEmployee = false,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireEmployee?: boolean;
  title?: string;
  subtitle?: string;
  theme?: string;
}) {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!token || !user) return router.replace('/login');
    if (requireAdmin && user.role !== 'ADMIN') return router.replace('/employee');
    if (requireEmployee && user.role !== 'EMPLOYEE') return router.replace('/admin');
    setOk(true);
  }, [router, requireAdmin, requireEmployee]);

  if (!ok) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D2B4E', color: 'white', fontSize: 18 }}>
        Loading…
      </div>
    );
  }

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateRows: '56px 1fr',
        height: '100vh',
        overflow: 'hidden',
        background: '#F7FAFF',
      }}>
        {/* ROW 1: Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* ROW 2: Two columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          overflow: 'hidden',
          minHeight: 0,
        }}>
          {/* COLUMN 1: Sidebar */}
          <div style={{
            width: 240,
            height: '100%',
            overflowY: 'auto',
            background: '#FFFFFF',
            borderRight: '1px solid #E2E8F0',
            display: sidebarOpen ? 'block' : 'none',
          }}
          className="sidebar-desktop"
          >
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>

          {/* COLUMN 2: Main content */}
          <main style={{
            height: '100%',
            overflowY: 'auto',
            padding: '24px',
            minWidth: 0,
          }}>
            <div style={{ maxWidth: 1300, margin: '0 auto' }}>
              {title && (
                <div style={{ marginBottom: 24 }}>
                  <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>
                    {title}
                  </h1>
                  {subtitle && (
                    <p style={{ marginTop: 6, fontSize: 14, color: '#64748b' }}>
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 30,
          }}
          className="sidebar-overlay"
        />
      )}
      {sidebarOpen && (
        <div style={{
          position: 'fixed', top: 56, left: 0, bottom: 0, width: 240,
          zIndex: 40, background: 'white', overflowY: 'auto',
          boxShadow: '4px 0 12px rgba(0,0,0,0.15)',
        }}
        className="sidebar-mobile"
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>
      )}

      <style jsx global>{
        .sidebar-desktop { display: block !important; }
        .sidebar-mobile { display: none; }
        .sidebar-overlay { display: none; }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile { display: block; }
          .sidebar-overlay { display: block; }
        }
      }</style>
    </>
  );
}
