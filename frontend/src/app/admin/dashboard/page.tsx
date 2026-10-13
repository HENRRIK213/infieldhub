'use client';
import Layout from '@/components/Layout';
import ActivityFeed from '@/components/ActivityFeed';
import { api } from '@/lib/api';
import { connectAdminSocket } from '@/lib/socket';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(u);
    if (u?.role === 'ADMIN') {
      api
        .get('/reports/summary')
        .then((r) => setSummary(r.data))
        .catch(() => {});
      connectAdminSocket(() => {});
    }
  }, []);

  return (
    <Layout>
      <h1 className="text-xl md:text-2xl font-bold text-[#0D2B4E]">
        Welcome, {user?.name || user?.email}
      </h1>
      <p className="text-sm text-gray-500 mb-6">Role: {user?.role}</p>

      {user?.role === 'ADMIN' && summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
          {Object.entries(summary).map(([k, v]) => (
            <div key={k} className="card text-center !p-4">
              <div className="text-2xl md:text-3xl font-bold text-[#1E88E5]">
                {v as number}
              </div>
              <div className="text-[10px] md:text-xs text-gray-500 mt-1 capitalize">
                {k}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="card">
          <h2 className="font-semibold text-[#0D2B4E] mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/products" className="block btn-primary text-center">
              Browse Products
            </Link>
            <Link href="/quotations" className="block btn-navy text-center">
              Create Quotation
            </Link>
            {user?.role === 'ADMIN' && (
              <>
                <Link href="/admin" className="block btn-success text-center">
                  Admin Console
                </Link>
                <Link href="/admin/logs" className="block btn-navy text-center">
                  View Logs
                </Link>
                <Link href="/admin/reports" className="block btn-navy text-center">
                  Reports
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
      </div>
    </Layout>
  );
}