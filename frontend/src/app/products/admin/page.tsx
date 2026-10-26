'use client';
import Layout from '@/components/Layout';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', size: '', brand: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products').then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditProduct(null);
    setFormData({ name: '', description: '', price: '', size: '', brand: '' });
    setImageFile(null); setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditProduct(p);
    setFormData({ name: p.name, description: p.description || '', price: p.price, size: p.size || '', brand: p.brand || '' });
    setImageFile(null); setShowModal(true);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const fd = new FormData();
    fd.append('name', formData.name); 
    fd.append('description', formData.description || ''); 
    fd.append('price', formData.price); 
    fd.append('size', formData.size); 
    fd.append('brand', formData.brand);
    if (editProduct?.parentId) fd.append('parentId', editProduct.parentId);
    if (imageFile) fd.append('image', imageFile);

    try {
      if (editProduct) {
        // THE FIX: Do NOT set 'Content-Type': 'multipart/form-data' manually.
        // Axios automatically sets it with the correct boundary when it detects FormData.
        await api.put(`/products/${editProduct.id}`, fd);
      } else {
        await api.post('/products', fd);
      }
      
      setShowModal(false); 
      alert('✅ Product saved successfully!');
      window.location.reload();
    } catch (err: any) { 
      alert('❌ Failed to save: ' + (err.response?.data?.error || err.message)); 
    }
  };

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Product Management</h1>
          <button onClick={openAdd} style={{ background: '#1E88E5', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>+ Add Product</button>
        </div>

        {loading ? <div>Loading...</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            {products.map((main: any) => (
              <div key={main.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
                <div style={{ display: 'flex', gap: 20, borderBottom: '1px solid #f1f5f9', paddingBottom: 16, marginBottom: 16 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>{main.name}</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
                  {main.children?.map((sub: any) => (
                    <div key={sub.id} style={{ background: '#F8FAFC', borderRadius: 8, border: '1px solid #e2e8f0', padding: 12 }}>
                      <div style={{ height: 120, background: '#fff', borderRadius: 6, marginBottom: 12 }}>
                        {sub.imageUrl ? <img src={sub.imageUrl.startsWith('http') ? sub.imageUrl : `${UPLOADS_URL}${sub.imageUrl}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <div style={{textAlign:'center', paddingTop:40, fontSize: 24}}>📦</div>}
                      </div>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0D2B4E', margin: '0 0 4px 0' }}>{sub.name}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#1E88E5' }}>KSH {sub.price.toLocaleString()}</span>
                        <button onClick={() => openEdit(sub)} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>✏️ Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', width: 500, borderRadius: 12, padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>{editProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={submitForm} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Price</label>
                <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6, minHeight: 60 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Image</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 12, background: '#f1f5f9', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: 12, background: '#1E88E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
