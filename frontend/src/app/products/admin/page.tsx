'use client';
import Layout from '@/components/Layout';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', vat: 'true', stock: '1', category: 'Solar', size: '', brand: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products').then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); fetchProducts(); } catch (e) { alert('Failed'); }
  };

  const openAddMain = () => {
    setEditProduct(null); setParentId(null);
    setFormData({ name: '', description: '', price: '', vat: 'true', stock: '1', category: 'Solar', size: '', brand: '' });
    setImageFile(null); setShowModal(true);
  };

  const openAddSub = (parent: any) => {
    setEditProduct(null); setParentId(parent.id);
    setFormData({ name: '', description: '', price: '', vat: 'true', stock: '1', category: parent.category, size: '', brand: '' });
    setImageFile(null); setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditProduct(p); setParentId(p.parentId);
    setFormData({ name: p.name, description: p.description || '', price: p.price, vat: p.vat ? 'true' : 'false', stock: p.stock, category: p.category, size: p.size || '', brand: p.brand || '' });
    setImageFile(null); setShowModal(true);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', formData.name); fd.append('description', formData.description || ''); 
    fd.append('price', formData.price); fd.append('vat', formData.vat); fd.append('stock', formData.stock);
    fd.append('category', formData.category); fd.append('size', formData.size); fd.append('brand', formData.brand);
    if (parentId) fd.append('parentId', parentId);
    if (imageFile) fd.append('image', imageFile);

    try {
      if (editProduct) await api.put(`/products/${editProduct.id}`, fd);
      else await api.post('/products', fd);
      setShowModal(false); fetchProducts();
    } catch (err: any) { alert('Failed: ' + (err.response?.data?.error || err.message)); }
  };

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Product Management</h1>
          <button onClick={openAddMain} style={{ background: '#1E88E5', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>+ Add Main Product</button>
        </div>

        {loading ? <div>Loading...</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            {products.map((main: any) => (
              <div key={main.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
                <div style={{ display: 'flex', gap: 20, borderBottom: '1px solid #f1f5f9', paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0D2B4E', margin: '0 0 8px 0' }}>{main.name}</h2>
                    <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{main.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openAddSub(main)} style={{ background: '#E0F2FE', color: '#0369A1', border: 'none', padding: '8px 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>+ Add Type</button>
                    <button onClick={() => openEdit(main)} style={{ background: '#F1F5F9', color: '#475569', border: 'none', padding: '8px 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>✏️ Edit</button>
                    <button onClick={() => handleDelete(main.id)} style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', padding: '8px 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
                  {main.children?.map((sub: any) => (
                    <div key={sub.id} style={{ background: '#F8FAFC', borderRadius: 8, border: '1px solid #e2e8f0', padding: 12 }}>
                      <div style={{ height: 120, background: '#fff', borderRadius: 6, marginBottom: 12 }}>
                        {sub.imageUrl ? <img src={sub.imageUrl.startsWith('http') ? sub.imageUrl : `${UPLOADS_URL}${sub.imageUrl}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <div style={{textAlign:'center', paddingTop:40, fontSize: 24}}>📦</div>}
                      </div>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0D2B4E', margin: '0 0 4px 0' }}>{sub.name}</h3>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                        {sub.size && <span style={{ fontSize: 10, background: '#E2E8F0', padding: '2px 6px', borderRadius: 4 }}>{sub.size}</span>}
                        {sub.brand && <span style={{ fontSize: 10, background: '#E2E8F0', padding: '2px 6px', borderRadius: 4 }}>{sub.brand}</span>}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#1E88E5' }}>KSH {sub.price.toLocaleString()}</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => openEdit(sub)} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>✏️</button>
                          <button onClick={() => handleDelete(sub.id)} style={{ background: '#FEE2E2', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>🗑️</button>
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', width: 500, borderRadius: 12, padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>{editProduct ? 'Edit Product' : (parentId ? 'Add Sub-type' : 'Add Main Product')}</h2>
            <form onSubmit={submitForm} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              {parentId && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, fontWeight: 700 }}>Size</label>
                    <input value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, fontWeight: 700 }}>Brand</label>
                    <input value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                  </div>
                </div>
              )}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Price</label>
                <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Image (Leave blank to keep existing)</label>
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
