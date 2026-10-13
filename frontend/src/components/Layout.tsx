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
    <div className={`min-h-screen flex flex-col ${themeClass}`}>
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 relative">
        <div
          className={`
            fixed md:static inset-y-0 left-0 z-40 top-14 md:top-0
            transform transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden top-14"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 w-full">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
            {title && (
              <div className="mb-8 text-center">
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