'use client';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const user =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || 'null')
      : null;

  const load = async () => {
    const res = await api.get('/products', { params: { search, category } });
    setProducts(res.data);
  };
  useEffect(() => {
    load();
  }, [search, category]);

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[#0D2B4E]">Products</h1>
        <div className="flex flex-wrap gap-2">
          <input
            className="input flex-1 sm:flex-none sm:w-56"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input w-32 sm:w-auto"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Solar">Solar</option>
            <option value="Electrical">Electrical</option>
            <option value="Water">Water</option>
          </select>
          {user && (
            <button className="btn-primary whitespace-nowrap" onClick={() => setShowAdd(true)}>
              + Add
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      )}

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
      {showAdd && (
        <AddProductModal
          onClose={() => {
            setShowAdd(false);
            load();
          }}
        />
      )}
    </Layout>
  );
}

function AddProductModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<any>({
    name: '',
    description: '',
    longDescription: '',
    price: '',
    vat: false,
    category: 'Solar',
    subCategory: '',
    stock: 0,
  });
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, String(v)));
    if (image) data.append('image', image);
    try {
      await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onClose();
    } catch {
      alert('Failed to add product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#0D2B4E] mb-4">
          Add New Product
        </h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label">Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Short Description</label>
            <input
              className="input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Deep Description (shown when product is clicked)</label>
            <textarea
              rows={4}
              className="input"
              value={form.longDescription}
              onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Price (KES)</label>
              <input
                type="number"
                className="input"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Stock</label>
              <input
                type="number"
                className="input"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select
                className="input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option>Solar</option>
                <option>Electrical</option>
                <option>Water</option>
              </select>
            </div>
            <div>
              <label className="label">Sub-category</label>
              <input
                className="input"
                value={form.subCategory}
                onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.vat}
              onChange={(e) => setForm({ ...form, vat: e.target.checked })}
            />
            <label className="text-sm">VAT applicable</label>
          </div>
          <div>
            <label className="label">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="text-sm"
            />
          </div>
          <div className="flex gap-2 justify-end pt-3">
            <button type="button" onClick={onClose} className="btn-navy">
              Cancel
            </button>
            <button disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}