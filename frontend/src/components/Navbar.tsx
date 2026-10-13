'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const path = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  const user =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || 'null')
      : null;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const adminLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/employees', label: 'Employees' },
    { href: '/admin/customers', label: 'Customers' },
    { href: '/admin/payments', label: 'Payments' },
    { href: '/admin/logs', label: 'Logs' },
  ];

  const employeeLinks = [
    { href: '/employee', label: 'Dashboard' },
    { href: '/employee/links', label: 'Customer Links' },
    { href: '/products', label: 'Products' },
    { href: '/quotations', label: 'Quotations' },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : employeeLinks;

  // ==== INLINE STYLES — guaranteed to work even if Tailwind fails ====
  const headerStyle: React.CSSProperties = {
    background: '#0D2B4E',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(13, 43, 78, 0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  };

  const innerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    height: '52px',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const leftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const logoBoxStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    background: '#fff',
    borderRadius: '6px',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  };

  const logoImgStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    objectFit: 'contain',
    display: 'block',
  };

  const brandTextStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.02em',
    lineHeight: 1,
  };

  const taglineStyle: React.CSSProperties = {
    fontSize: '8px',
    color: '#4FC3F7',
    fontWeight: 600,
    letterSpacing: '0.15em',
    marginTop: '3px',
    lineHeight: 1,
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: '13px',
  };

  const linkStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 12px',
    borderRadius: '6px',
    fontWeight: 500,
    color: active ? '#fff' : 'rgba(255,255,255,0.9)',
    background: active ? '#1E88E5' : 'transparent',
    transition: 'background 0.15s ease',
    textDecoration: 'none',
  });

  const logoutBtnStyle: React.CSSProperties = {
    marginLeft: '10px',
    background: '#4FC3F7',
    color: '#0D2B4E',
    padding: '6px 14px',
    borderRadius: '6px',
    fontWeight: 700,
    fontSize: '12px',
    border: 'none',
    cursor: 'pointer',
  };

  const hamburgerStyle: React.CSSProperties = {
    fontSize: '20px',
    color: '#fff',
    marginRight: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <header style={headerStyle}>
      <div style={innerStyle}>
        {/* LEFT SIDE */}
        <div style={leftStyle}>
          <button
            className="md:hidden"
            style={hamburgerStyle}
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <Link
            href={user?.role === 'ADMIN' ? '/admin' : '/employee'}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            prefetch={false}
          >
            {/* SMALL LOGO — 28px */}
            <div style={logoBoxStyle}>
              <img
                src="/logo.png"
                alt="Infield"
                style={logoImgStyle}
                onError={(e: any) => {
                  e.target.style.display = 'none';
                  if (e.target.parentElement) {
                    e.target.parentElement.innerHTML =
                      '<span style="color:#0D2B4E;font-size:12px;font-weight:900">iF</span>';
                  }
                }}
              />
            </div>

            {/* TEXT BRAND */}
            <div style={{ lineHeight: 1 }}>
              <div style={brandTextStyle}>InfieldHub</div>
              <div style={taglineStyle} className="hidden sm:block">
                SOLAR • ELECTRICAL • WATER
              </div>
            </div>
          </Link>
        </div>

        {/* RIGHT SIDE — Desktop nav */}
        <nav style={navStyle} className="hidden md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} prefetch={false} style={linkStyle(path === l.href)}>
              {l.label}
            </Link>
          ))}
          <button onClick={logout} style={logoutBtnStyle}>
            Logout
          </button>
        </nav>

        {/* Mobile avatar */}
        <div className="md:hidden" style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              width: '32px',
              height: '32px',
              background: '#1E88E5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </button>
          {profileOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                marginTop: '8px',
                width: '220px',
                background: '#fff',
                color: '#0D2B4E',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
                padding: '8px 0',
                zIndex: 60,
                border: '1px solid #f1f5f9',
              }}
            >
              <div
                style={{
                  padding: '8px 16px',
                  borderBottom: '1px solid #f1f5f9',
                  fontSize: '11px',
                  color: '#64748b',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.email}
              </div>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch={false}
                  onClick={() => setProfileOpen(false)}
                  style={{
                    display: 'block',
                    padding: '10px 16px',
                    fontSize: '14px',
                    color: '#0D2B4E',
                    textDecoration: 'none',
                  }}
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={logout}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 16px',
                  fontSize: '14px',
                  color: '#DC2626',
                  background: 'none',
                  border: 'none',
                  borderTop: '1px solid #f1f5f9',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}