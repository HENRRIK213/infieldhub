'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/links', label: 'Link Generator', icon: '🔗' },
  { href: '/admin/employees', label: 'Employees', icon: '👥' },
  { href: '/admin/customers', label: 'Customers', icon: '🧑‍💼' },
  { href: '/admin/payments', label: 'Payments', icon: '💳' },
  { href: '/admin/logs', label: 'Activity Logs', icon: '📋' },
  { href: '/admin/reports', label: 'Reports', icon: '📈' },
  { href: '/admin/profile', label: 'My Profile', icon: '⚙️' },
];

const employeeLinks = [
  { href: '/employee', label: 'Dashboard', icon: '📊' },
  { href: '/employee/links', label: 'Customer Links', icon: '🔗' },
  { href: '/products', label: 'Products', icon: '📦' },
  { href: '/quotations', label: 'Quotations', icon: '📄' },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    setRole(user?.role || '');
  }, []);

  const links = role === 'ADMIN' ? adminLinks : employeeLinks;

  return (
    <aside
      style={{
        width: '240px',
        background: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        padding: '16px',
        boxShadow: '2px 0 8px rgba(13,43,78,0.04)',
        minHeight: 'calc(100vh - 64px)',
        alignSelf: 'flex-start',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          color: '#94a3b8',
          fontWeight: 700,
          letterSpacing: '0.1em',
          marginBottom: '12px',
          paddingLeft: '12px',
        }}
      >
        {role === 'ADMIN' ? 'Admin Menu' : 'Employee Menu'}
      </div>
      {links.map((l) => {
        const active = path === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            prefetch={false}
            onClick={onNavigate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: active ? 700 : 500,
              color: active ? '#FFFFFF' : '#0D2B4E',
              background: active ? '#1E88E5' : 'transparent',
              textDecoration: 'none',
              marginBottom: '4px',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => {
              if (!active) e.currentTarget.style.background = '#F1F5F9';
            }}
            onMouseOut={(e) => {
              if (!active) e.currentTarget.style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: '16px' }}>{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
