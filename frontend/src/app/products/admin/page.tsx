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
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', type: '', brand: '', size: '', stock: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products').then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const groupedProducts: { [key: string]: any[] } = {};
  products.forEach(p => {
    const cat = p.category || 'General Products';
    if (!groupedProducts[cat]) groupedProducts[cat] = [];
    groupedProducts[cat].push(p);
  });

  const openAdd = (categoryName = '') => {
    setEditProduct(null);
    setErrorMsg('');
    setFormData({ name: '', description: '', price: '', category: categoryName, type: '', brand: 'Generic', size: '', stock: 10 });
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
    setIsSaving(true);
    
    const fd = new FormData();
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
      if (editProduct && editProduct.id) {
        // UPDATE EXISTING - Do NOT set manual headers for FormData
        await api.put(`/products/${editProduct.id}`, fd);
      } else {
        // CREATE NEW
        await api.post('/products', fd);
      }
      setShowModal(false); 
      alert('✅ Saved successfully!');
      fetchProducts();
    } catch (err: any) { 
      setErrorMsg(err.response?.data?.error || 'Failed to save. Please refresh the page.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E' }}>Product Management</h1>
          <button onClick={() => openAdd()} style={{ background: '#1E88E5', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>+ Add Main Product</button>
        </div>

        {loading ? <div>Loading...</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            {Object.keys(groupedProducts).map(mainCategory => (
              <div key={mainCategory} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: 16, marginBottom: 16 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>{mainCategory}</h2>
                  <button onClick={() => openAdd(mainCategory)} style={{ background: '#E1F5FE', color: '#0277BD', border: 'none', padding: '6px 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>+ Add Sub-Product</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {groupedProducts[mainCategory].map(sub => (
                    <div key={sub.id} style={{ background: '#F8FAFC', borderRadius: 8, border: '1px solid #e2e8f0', padding: 16, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: 120, background: '#fff', borderRadius: 6, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {sub.imageUrl ? <img src={`${UPLOADS_URL}${sub.imageUrl}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: 32 }}>📦</span>}
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0D2B4E', marginBottom: 4 }}>{sub.name}</h3>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                        {sub.size && <span style={{ fontSize: 11, background: '#E2E8F0', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{sub.size}</span>}
                        {sub.brand && <span style={{ fontSize: 11, background: '#E2E8F0', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{sub.brand}</span>}
                      </div>
                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 16, fontWeight: 900, color: '#1E88E5' }}>KSH {sub.price.toLocaleString()}</span>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => openEdit(sub)} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                          <button onClick={() => handleDelete(sub.id)} style={{ background: '#FEE2E2', color: '#B91C1C', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>🗑️</button>
                        </div>
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
                <label style={{ fontSize: 12, fontWeight: 700 }}>Main Category</label>
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
                <input value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} placeholder="e.g. 2 inch" style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
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
                <button type="button" onClick={() => setShowModal(false)} disabled={isSaving} style={{ flex: 1, padding: 14, background: '#F1F5F9', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={isSaving} style={{ flex: 1, padding: 14, background: isSaving ? '#94a3b8' : '#1E88E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
