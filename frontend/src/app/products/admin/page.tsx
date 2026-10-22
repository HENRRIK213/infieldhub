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
  const [formData, setFormData] = useState({ name: '', description: '', price: '', vat: 'true', stock: '1', category: 'Solar' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // ADDED NEW CATEGORIES HERE
  const categories = ['Solar', 'Electrical', 'Water', 'Accessories', 'All Accessories', 'Borehole Accessories', 'Services'];

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products').then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will delete the product and all its sub-types.')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (e) { alert('Failed to delete'); }
  };

  const openAddMain = () => {
    setEditProduct(null);
    setParentId(null);
    setFormData({ name: '', description: '', price: '', vat: 'true', stock: '1', category: 'Solar' });
    setImageFile(null);
    setShowModal(true);
  };

  const openAddSub = (parent: any) => {
    setEditProduct(null);
    setParentId(parent.id);
    setFormData({ name: '', description: '', price: '', vat: 'true', stock: '1', category: parent.category || 'Solar' });
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditProduct(p);
    setParentId(p.parentId);
    setFormData({ 
      name: p.name, 
      description: p.description || '', 
      price: p.price, 
      vat: p.vat ? 'true' : 'false', 
      stock: p.stock, 
      category: p.category || 'Solar' 
    });
    setImageFile(null);
    setShowModal(true);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('description', formData.description || ''); 
    fd.append('price', formData.price);
    fd.append('vat', formData.vat);
    fd.append('stock', formData.stock);
    fd.append('category', formData.category);
    if (parentId) fd.append('parentId', parentId);
    if (imageFile) fd.append('image', imageFile);

    try {
      if (editProduct) {
        // REMOVED manual headers so Axios handles the boundaries correctly
        await api.put(`/products/${editProduct.id}`, fd);
      } else {
        await api.post('/products', fd);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      alert('Failed to save product: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Product Management</h1>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Manage Main Products and their Sub-types.</p>
          </div>
          <button onClick={openAddMain} style={{ background: '#1E88E5', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            + Add Main Product
          </button>
        </div>

        {loading ? <div>Loading...</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            {products.map((main: any) => (
              <div key={main.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
                
                <div style={{ display: 'flex', gap: 20, borderBottom: '1px solid #f1f5f9', paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ width: 100, height: 100, background: '#f8fafc', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {main.imageUrl ? (
                      <img src={main.imageUrl.startsWith('http') ? main.imageUrl : `${UPLOADS_URL}${main.imageUrl}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : <span style={{ fontSize: 32 }}>📦</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0D2B4E', margin: '0 0 8px 0' }}>{main.name}</h2>
                    <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px 0' }}>{main.description || 'No description added yet.'}</p>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#1E88E5' }}>Base Price: KSH {main.price.toLocaleString()}</span>
                      <span style={{ fontSize: 11, background: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>{main.category}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <button onClick={() => openAddSub(main)} style={{ background: '#E0F2FE', color: '#0369A1', border: 'none', padding: '8px 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>+ Add Type</button>
                    <button onClick={() => openEdit(main)} style={{ background: '#F1F5F9', color: '#475569', border: 'none', padding: '8px 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>✏️ Edit</button>
                    <button onClick={() => handleDelete(main.id)} style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', padding: '8px 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>🗑️ Delete</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16, paddingLeft: 20, borderLeft: '3px solid #e2e8f0' }}>
                  {main.children?.length === 0 && <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>No sub-types added yet. Click "+ Add Type" to add variations.</div>}
                  
                  {main.children?.map((sub: any) => (
                    <div key={sub.id} style={{ background: '#F8FAFC', borderRadius: 8, border: '1px solid #e2e8f0', padding: 12, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: 120, background: '#fff', borderRadius: 6, marginBottom: 12, overflow: 'hidden' }}>
                        {sub.imageUrl ? (
                          <img src={sub.imageUrl.startsWith('http') ? sub.imageUrl : `${UPLOADS_URL}${sub.imageUrl}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📦</div>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0D2B4E', margin: '0 0 4px 0' }}>{sub.name}</h3>
                        <p style={{ fontSize: 11, color: '#64748b', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{sub.description || 'No description'}</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#1E88E5' }}>KSH {sub.price.toLocaleString()}</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => openEdit(sub)} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>✏️ Edit</button>
                          <button onClick={() => handleDelete(sub.id)} style={{ background: '#FEE2E2', border: 'none', padding: '6px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#991B1B' }}>🗑️</button>
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
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
              {editProduct ? 'Edit Product' : (parentId ? 'Add Sub-type' : 'Add Main Product')}
            </h2>
            
            <form onSubmit={submitForm} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {editProduct && editProduct.imageUrl && (
                <div style={{ textAlign: 'center', marginBottom: 10 }}>
                  <img src={editProduct.imageUrl.startsWith('http') ? editProduct.imageUrl : `${UPLOADS_URL}${editProduct.imageUrl}`} style={{ height: 80, borderRadius: 6 }} />
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Current Image</div>
                </div>
              )}

              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Description (Optional)</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6, minHeight: 60 }} />
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 700 }}>Price (KSH)</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 700 }}>Stock</label>
                  <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>VAT (16%?)</label>
                <select value={formData.vat} onChange={e => setFormData({...formData, vat: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }}>
                  <option value="true">Include VAT (16%)</option>
                  <option value="false">No VAT (0%)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Image {editProduct && '(Leave blank to keep existing)'}</label>
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
