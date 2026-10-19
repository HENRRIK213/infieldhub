'use client';
import Layout from '@/components/Layout';

export default function InventoryPage() {
  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1200, margin: '0 auto', background: '#fff', padding: 40, borderRadius: 16, textAlign: 'center', border: '1px solid #e2e8f0' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', marginBottom: 16 }}>Inventory Center</h1>
        <p style={{ color: '#64748b' }}>This module is currently being configured for live production.</p>
      </div>
    </Layout>
  );
}
