'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!token || !user) return router.replace('/login');
    if (user.role === 'ADMIN') router.replace('/admin');
    else if (user.role === 'EMPLOYEE') router.replace('/employee');
    else router.replace('/products');
  }, [router]);
  return <div className="page-navy text-white flex items-center justify-center min-h-screen text-xl">Loading InfieldHub…</div>;
}