'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
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

    checkSession();
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [router, pathname]);

  return <>{children}</>;
}