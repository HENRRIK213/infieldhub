'use client';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Theme = 'navy' | 'blue' | 'teal' | 'cream' | 'white';

export default function Layout({
  children,
  requireAdmin = false,
  requireEmployee = false,
  title,
  subtitle,
  theme = 'cream',
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireEmployee?: boolean;
  title?: string;
  subtitle?: string;
  theme?: Theme;
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
      <div className="min-h-screen flex items-center justify-center bg-[#0D2B4E]">
        <div className="text-white text-lg">Loading…</div>
      </div>
    );
  }

  const themeClass =
    {
      navy: 'page-navy',
      blue: 'page-blue',
      teal: 'page-teal',
      cream: 'page-cream',
      white: 'page-white',
    }[theme] || 'page-cream';

  const isDark = theme === 'navy' || theme === 'blue' || theme === 'teal';

  return (
    <div
      className={themeClass}
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative' }}>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            z-40
            ${sidebarOpen ? 'fixed top-14 bottom-0 left-0 w-64 block' : 'hidden'}
            md:block md:relative md:w-64 md:flex-shrink-0 md:top-0 md:bottom-auto
          `}
          style={{ height: '100%', overflowY: 'auto' }}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0, height: '100%', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
            {title && (
              <div className="mb-6">
                <h1
                  className={`text-2xl md:text-3xl font-extrabold ${
                    isDark ? 'text-white' : 'text-[#0D2B4E]'
                  }`}
                >
                  {title}
                </h1>
                {subtitle && (
                  <p
                    className={`mt-2 text-sm ${
                      isDark ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
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
  );
}
