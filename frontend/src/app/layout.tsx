'use client';
import './globals.css';
// Cache Buster: 1998857067
// Cache Buster: 1283415659
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const metadata = {
  title: 'InfieldHub | Integrated Stock Management',
  description: 'Solar, Electrical, and Water solutions management system.',
  icons: {
    icon: '/icon.png', // Forces Next.js to use the icon in the app folder
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 6-Hour Auto Logout Logic
    const checkSession = () => {
      const loginTime = localStorage.getItem('loginTime');
      const token = localStorage.getItem('token');
      
      if (loginTime && token) {
        const sixHours = 6 * 60 * 60 * 1000;
        const timePassed = Date.now() - parseInt(loginTime);
        
        if (timePassed > sixHours) {
          // Session expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('loginTime');
          router.push('/login');
        }
      }
    };

    // Check immediately on load
    checkSession();

    // Check every minute while the app is open
    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  }, [router, pathname]);

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}



