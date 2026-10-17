'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Solar', stock: '1' });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('category', form.category);
      fd.append('stock', form.stock);
      if (image) fd.append('image', image);

      await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      router.push('/products');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', padding: 30, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', marginBottom: 20 }}>Add New Product</h1>
        {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: 12, borderRadius: 8, marginBottom: 16 }}>{error}</div>}
        
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E', display: 'block', marginBottom: 6 }}>Product Name</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #CBD5E1' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #CBD5E1', height: 80 }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E', display: 'block', marginBottom: 6 }}>Price (KES)</label>
              <input required type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #CBD5E1' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E', display: 'block', marginBottom: 6 }}>Stock</label>
              <input required type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #CBD5E1' }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E', display: 'block', marginBottom: 6 }}>Image</label>
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #CBD5E1' }} />
          </div>
          <button type="submit" disabled={loading} style={{ background: '#1E88E5', color: '#fff', padding: 14, borderRadius: 8, border: 'none', fontWeight: 700, cursor: loading ? 'wait' : 'pointer', marginTop: 10 }}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
