'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const path = usePathname();
  const navLinks = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Analytics', href: '/admin/analytics' },
    { label: 'Invoicing & Quotes', href: '/admin/documents' },
    { label: 'Dispatch Center', href: '/admin/dispatch' },
    { label: 'Inventory', href: '/admin/inventory' },
    { label: 'Compliance', href: '/admin/compliance' },
  ];

  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0D2B4E', padding: '0 20px', height: 64, color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onMenuClick} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>☰</button>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <div style={{ background: '#fff', padding: '4px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.png" alt="InfieldHub" style={{ height: 32, objectFit: 'contain' }} />
          </div>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {navLinks.map(link => {
          const active = path === link.href || (link.href !== '/admin' && path.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href} style={{
              padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none',
              color: active ? '#0D2B4E' : '#e2e8f0', background: active ? '#1E88E5' : 'transparent',
              transition: 'all 0.2s'
            }}>
              {link.label}
            </Link>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', position: 'relative' }}>
          🔔
          <span style={{ position: 'absolute', top: -2, right: -2, background: '#ef4444', color: '#fff', fontSize: 9, width: 14, height: 14, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</span>
        </button>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16 }}>A</div>
      </div>
    </nav>
  );
}
