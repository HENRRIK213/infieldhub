'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const path = usePathname();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, title: 'System Live', msg: 'InfieldHub is now running on Vercel', time: 'Just now', icon: '🚀' },
    { id: 2, title: 'New Quote Generated', msg: 'QUOTATION for THE CLIENT was created', time: '2 mins ago', icon: '🧾' },
    { id: 3, title: 'Database Connected', msg: 'Render successfully connected to Neon DB', time: '10 mins ago', icon: '🗄️' }
  ]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setShowNotifs(false);
    if (showNotifs) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [showNotifs]);

  const navLinks = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Analytics', href: '/admin/analytics' },
    { label: 'Invoicing & Quotes', href: '/admin/documents' },
    { label: 'Dispatch Center', href: '/admin/dispatch' },
    { label: 'Inventory', href: '/admin/inventory' },
    { label: 'Compliance', href: '/admin/compliance' },
  ];

  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0D2B4E', padding: '0 24px', height: 64, color: '#fff', position: 'relative', zIndex: 50 }}>
      
      {/* LEFT: Menu & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onMenuClick} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          ☰
        </button>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', height: '100%' }}>
          <div style={{ background: '#fff', padding: '4px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.png" alt="InfieldHub" style={{ height: 32, objectFit: 'contain' }} />
          </div>
        </Link>
      </div>

      {/* MIDDLE: Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: '100%' }}>
        {navLinks.map(link => {
          const active = path === link.href || (link.href !== '/admin' && path.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href} style={{
              display: 'flex', alignItems: 'center', height: 40, padding: '0 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none',
              color: active ? '#0D2B4E' : '#e2e8f0', background: active ? '#1E88E5' : 'transparent',
              transition: 'all 0.2s', marginTop: 'auto', marginBottom: 'auto'
            }}>
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* RIGHT: Notifications & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowNotifs(!showNotifs); }} 
            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}
          >
            🔔
            {notifications.length > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: 10, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {notifications.length}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifs && (
            <div 
              onClick={(e) => e.stopPropagation()} 
              style={{ position: 'absolute', top: 45, right: -10, width: 320, background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', overflow: 'hidden' }}
            >
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 800, color: '#0D2B4E', fontSize: 14 }}>
                Notifications
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 18 }}>{n.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E' }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2, lineHeight: 1.4 }}>{n.msg}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 10, textAlign: 'center', background: '#f8fafc', fontSize: 12, fontWeight: 700, color: '#1E88E5', cursor: 'pointer' }}>
                Mark all as read
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16 }}>
          A
        </div>
      </div>
    </nav>
  );
}
