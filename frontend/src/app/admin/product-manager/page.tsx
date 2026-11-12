'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Edit/Add Modal State
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', type: '', brand: '', size: '', stock: 10
  });

  const fetchProducts = () => {
    setLoading(true);
    api.get(`/products?t=${Date.now()}`).then(r => { setProducts(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditProduct(null);
    setFormData({ name: '', description: '', price: '', category: '', type: '', brand: '', size: '', stock: 10 });
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditProduct(p);
    setFormData({
      name: p.name, description: p.description || '', price: String(p.price),
      category: p.category || '', type: p.type || '', brand: p.brand || '', size: p.size || '', stock: p.stock || 0
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product permanently?')) return;
    try { await api.delete(`/products/${id}`); fetchProducts(); } catch { alert('Failed to delete'); }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
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
        await api.put(`/products/${editProduct.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      alert('✅ Product saved successfully!');
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert('Failed to save product.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter Products based on Search
  const filteredProducts = products.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.brand && p.brand.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query)) ||
      (p.type && p.type.toLowerCase().includes(query))
    );
  });

  // Extract unique brands and categories for datalists
  const existingBrands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
  const existingCategories = [...new Set(products.map(p => p.category).filter(Boolean))].sort();

  if (loading) return <Layout requireAdmin><div style={{ padding: 100, textAlign: 'center' }}>Loading...</div></Layout>;

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px', background: '#F1F5F9', minHeight: '100vh' }}>
        
        {/* Header & Search Bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0D2B4E', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 32 }}>📦</span> Product Manager
            </h1>
            <button onClick={openAdd} style={{ background: '#1E88E5', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 14 }}>
              + Add New Product
            </button>
          </div>

          <div style={{ position: 'relative', maxWidth: 600 }}>
            <input 
              type="text" 
              placeholder="Search by product name, brand, or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '16px 20px 16px 48px', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: 15, outline: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
            />
            <span style={{ position: 'absolute', left: 16, top: 16, fontSize: 20, color: '#94a3b8' }}>🔍</span>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: 18, color: '#64748b', fontWeight: 'bold' }}>No products found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {filteredProducts.map((p) => (
              <div key={p.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ background: '#0D2B4E', color: '#fff', textAlign: 'center', padding: '12px 0', fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {p.brand || 'GENERIC'}
                </div>
                <div style={{ height: 160, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                  <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.src = `https://placehold.co/400x300/F8FAFC/0D2B4E?text=${encodeURIComponent(p.category)}`; }} />
                </div>
                <div style={{ padding: 16, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0D2B4E', flex: 1, margin: '0 0 8px 0', lineHeight: 1.4 }}>{p.name}</h3>
                  <p style={{ fontSize: 20, fontWeight: 900, color: '#0D2B4E', margin: '0 0 16px 0' }}>KSH {p.price.toLocaleString()}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(p)} style={{ flex: 1, background: '#E1F5FE', color: '#0277BD', border: 'none', padding: '10px 0', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>✏️ Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{ flex: 1, background: '#FEE2E2', color: '#B91C1C', border: 'none', padding: '10px 0', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,43,78,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', width: 650, borderRadius: 16, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: '#0D2B4E' }}>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={submitForm} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Product Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Category</label>
                <input list="category-list" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Select or type new..." style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                <datalist id="category-list">{existingCategories.map(c => <option key={c} value={c} />)}</datalist>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Brand</label>
                <input list="brand-list" required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="Select or type new brand..." style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                <datalist id="brand-list">{existingBrands.map(b => <option key={b} value={b} />)}</datalist>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Type/Model</label>
                <input required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Size/Specs</label>
                <input required value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
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
                <label style={{ fontSize: 12, fontWeight: 700 }}>Upload Image {editProduct && '(Leave blank to keep existing)'}</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 14, background: '#F1F5F9', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={isSaving} style={{ flex: 1, padding: 14, background: '#1E88E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                  {isSaving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
