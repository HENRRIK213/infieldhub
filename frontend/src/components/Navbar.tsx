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
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0D2B4E', padding: '0 20px', height: 60, color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onMenuClick} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          ☰
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: '#fff', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#0D2B4E', fontWeight: 900, fontSize: 16 }}>IF</span>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1 }}>InfieldHub</div>
            <div style={{ fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em' }}>SOLAR • ELECTRICAL • WATER</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {navLinks.map(link => {
          const active = path === link.href || (link.href !== '/admin' && path.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href} style={{
              padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none',
              color: active ? '#0D2B4E' : '#e2e8f0',
              background: active ? '#1E88E5' : 'transparent',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Hi, Alex <span style={{ fontSize: 10 }}>▼</span></div>
        </div>
      </div>
    </nav>
  );
}
