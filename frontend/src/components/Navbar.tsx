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
        <button onClick={onMenuClick} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>☰</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: '#fff', padding: 4, borderRadius: 6, color: '#0D2B4E', fontWeight: 900, fontSize: 16 }}>IF</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1 }}>InfieldHub</div>
            <div style={{ fontSize: 9, color: '#94a3b8' }}>SOLAR • ELECTRICAL • WATER</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {navLinks.map(link => {
          const active = path === link.href;
          return (
            <Link key={link.href} href={link.href} style={{
              padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none',
              color: active ? '#0D2B4E' : '#e2e8f0', background: active ? '#1E88E5' : 'transparent'
            }}>{link.label}</Link>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Hi, Alex</div>
      </div>
    </nav>
  );
}
