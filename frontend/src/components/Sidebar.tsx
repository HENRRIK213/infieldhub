'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const adminLinks = [
  { href: '/admin/logs', label: 'Activity Logs', icon: '📋' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📉' },
  { href: '/admin/customers', label: 'Customers', icon: '🧑‍💼' },
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/employees', label: 'Employees', icon: '👥' },
  { href: '/admin/links', label: 'Link Generator', icon: '🔗' },
  { href: '/admin/profile', label: 'My Profile', icon: '⚙️' },
  { href: '/admin/payments', label: 'Payments', icon: '💳' },
  { href: '/admin/documents', label: 'PDF Generator', icon: '📄' },
  { href: '/admin/product-manager', label: 'Products', icon: '📦' }, // <-- FIXED: Goes to Admin page
  { href: '/admin/projects', label: 'Projects (Gantt)', icon: '📅' },
  { href: '/admin/documents/history', label: 'Quotations & Invoices', icon: '🧾' },
  { href: '/admin/reports', label: 'Reports', icon: '📈' },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    setRole(user?.role || '');
  }, []);

  return (
    <div style={{ padding: '16px', width: 240, height: '100%', background: '#fff', borderRight: '1px solid #E2E8F0', overflowY: 'auto' }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12, paddingLeft: 12 }}>Admin Menu</div>
      {adminLinks.map((l) => {
        const active = path === l.href;
        return (
          <Link key={l.href} href={l.href} prefetch={false} onClick={onNavigate} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
            borderRadius: 10, fontSize: 14, fontWeight: active ? 700 : 500,
            color: active ? '#FFFFFF' : '#0D2B4E', background: active ? '#1E88E5' : 'transparent',
            textDecoration: 'none', marginBottom: 4, transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 16 }}>{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        );
      })}
    </div>
  );
}






