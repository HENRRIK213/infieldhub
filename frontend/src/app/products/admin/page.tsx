'use client';
import Layout from '@/components/Layout';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', type: '', brand: '', size: '', stock: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products').then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditProduct(null);
    setErrorMsg('');
    setFormData({ name: '', description: '', price: '', category: 'Water Meters', type: '', brand: 'Generic', size: '', stock: 10 });
    setImageFile(null); setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditProduct(p);
    setErrorMsg('');
    setFormData({ 
      name: p.name, description: p.description || '', price: String(p.price), 
      category: p.category || '', type: p.type || '', brand: p.brand || '', size: p.size || '', stock: p.stock || 0 
    });
    setImageFile(null); setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product permanently?')) return;
    try { await api.delete(`/products/${id}`); fetchProducts(); } catch { alert('Failed to delete'); }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const fd = new FormData();
    
    // THE CRITICAL FIX: Only send ID if we are editing
    if (editProduct && editProduct.id) {
      fd.append('id', editProduct.id);
    }
    
    fd.append('name', formData.name); 
    fd.append('description', formData.description); 
    fd.append('price', formData.price); 
    fd.append('category', formData.category);
    fd.append('type', formData.type);
    fd.append('brand', formData.brand);
    fd.append('size', formData.size);
    fd.append('stock', String(formData.stock));
    if (imageFile) fd.append('image', imageFile);

    try {
      // Use POST for EVERYTHING to avoid 404 routing errors
      await api.post('/products', fd);
      setShowModal(false); 
      alert('✅ Saved successfully!');
      fetchProducts();
    } catch (err: any) { 
      setErrorMsg(err.response?.data?.error || 'Failed to save. Please refresh the page.');
    }
  };

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E' }}>Product Management</h1>
          <button onClick={openAdd} style={{ background: '#1E88E5', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>+ Add Product</button>
        </div>

        {loading ? <div>Loading...</div> : (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
              <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '16px' }}>Product Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th style={{ textAlign: 'right', paddingRight: 24 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#0D2B4E', display: 'flex', alignItems: 'center', gap: 10 }}>
                      {p.imageUrl ? <img src={`${UPLOADS_URL}${p.imageUrl}`} style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover' }} /> : <div style={{ width: 32, height: 32, background: '#F1F5F9', borderRadius: 4, textAlign: 'center', lineHeight: '32px' }}>📦</div>}
                      {p.name}
                    </td>
                    <td>{p.category}</td>
                    <td>{p.brand}</td>
                    <td style={{ fontWeight: 700, color: '#1E88E5' }}>KSH {p.price.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', paddingRight: 24 }}>
                      <button onClick={() => openEdit(p)} style={{ marginRight: 8, padding: '6px 12px', background: '#F59E0B', color: '#fff', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                      <button onClick={() => handleDelete(p.id)} style={{ padding: '6px 12px', background: '#EF4444', color: '#fff', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,43,78,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', width: 600, borderRadius: 16, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: '#0D2B4E' }}>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
            
            {errorMsg && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: 12, borderRadius: 8, marginBottom: 16 }}>{errorMsg}</div>}

            <form onSubmit={submitForm} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Product Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Category (Main Group)</label>
                <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Water Meters" style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Brand</label>
                <input required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Type/Model</label>
                <input value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Size/Specs</label>
                <input value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Price (KSH)</label>
                <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Stock Qty</label>
                <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6, minHeight: 60 }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Image {editProduct && '(Leave blank to keep existing)'}</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 14, background: '#F1F5F9', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: 14, background: '#1E88E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
