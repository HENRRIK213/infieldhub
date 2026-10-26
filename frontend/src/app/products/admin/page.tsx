'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', description: '', price: '', category: 'Water Solutions', type: '', brand: '', size: '', stock: 0 
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products')
      .then(r => setProducts(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditProduct(null);
    setFormData({ name: '', description: '', price: '', category: 'Water Solutions', type: '', brand: '', size: '', stock: 0 });
    setImageFile(null); setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditProduct(p);
    setFormData({ 
      name: p.name, description: p.description || '', price: p.price, 
      category: p.category || 'Water Solutions', type: p.type || '', brand: p.brand || '', size: p.size || '', stock: p.stock || 0 
    });
    setImageFile(null); setShowModal(true);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch { alert('Failed to delete product'); }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', formData.name); 
    fd.append('description', formData.description || ''); 
    fd.append('price', formData.price); 
    fd.append('category', formData.category);
    fd.append('type', formData.type);
    fd.append('brand', formData.brand);
    fd.append('size', formData.size);
    fd.append('stock', String(formData.stock));
    if (imageFile) fd.append('image', imageFile);

    try {
      if (editProduct) {
        // DO NOT set 'Content-Type': 'multipart/form-data' here. Axios handles it.
        await api.put(`/products/${editProduct.id}`, fd);
      } else {
        await api.post('/products', fd);
      }
      setShowModal(false); 
      alert('✅ Saved successfully!');
      fetchProducts();
    } catch (err: any) { 
      alert('❌ Failed to save: ' + (err.response?.data?.error || err.message)); 
    }
  };

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E' }}>Product Management</h1>
          <button onClick={openAdd} style={{ background: '#1E88E5', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>+ Add Product</button>
        </div>

        {loading ? <div>Loading...</div> : (
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
              <thead style={{ background: '#0D2B4E', color: '#fff' }}>
                <tr>
                  <th style={{ padding: 16 }}>Name</th>
                  <th>Type</th><th>Brand</th><th>Size</th><th>Price</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: 16, fontWeight: 600 }}>{p.name}</td>
                    <td>{p.type}</td><td>{p.brand}</td><td>{p.size}</td>
                    <td style={{ fontWeight: 700, color: '#1E88E5' }}>KSH {p.price.toLocaleString()}</td>
                    <td>
                      <button onClick={() => openEdit(p)} style={{ marginRight: 8, padding: '4px 8px', background: '#f59e0b', color: '#fff', borderRadius: 4, border: 'none', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deleteProduct(p.id)} style={{ padding: '4px 8px', background: '#ef4444', color: '#fff', borderRadius: 4, border: 'none', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', width: 600, borderRadius: 12, padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>{editProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={submitForm} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Price (KSH)</label>
                <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Stock</label>
                <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }}>
                  <option>Water Solutions</option><option>Solar Solutions</option><option>Electrical</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Type</label>
                <input value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Brand</label>
                <input value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Size</label>
                <input value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6, minHeight: 60 }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Image {editProduct && '(Leave blank to keep existing)'}</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', gap: 10, marginTop: 10 }}>
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