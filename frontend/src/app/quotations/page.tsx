'use client';
import Layout from '@/components/Layout';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function QuotationsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [customer, setCustomer] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .get('/products')
      .then((r) => setProducts(r.data))
      .catch((e) => setError(e.response?.data?.error || 'Failed to load products'));
  }, []);

  const addToCart = (p: any) => {
    const existing = cart.find((c) => c.id === p.id);
    if (existing) {
      setCart(cart.map((c) => (c.id === p.id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { ...p, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => setCart(cart.filter((c) => c.id !== id));

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) return removeFromCart(id);
    setCart(cart.map((c) => (c.id === id ? { ...c, quantity: qty } : c)));
  };

  const subtotal = cart.reduce((s, c) => s + Number(c.price) * c.quantity, 0);
  const vatAmount = cart.reduce(
    (s, c) => s + (c.vat ? Number(c.price) * c.quantity * 0.16 : 0),
    0
  );
  const total = subtotal + vatAmount;

  const submit = async () => {
    if (!cart.length) {
      alert('Add at least one product to the cart');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await api.post('/quotations', {
        items: cart.map((c) => ({
          id: c.id,
          name: c.name,
          price: Number(c.price),
          quantity: c.quantity,
          vat: c.vat,
        })),
        ...customer,
      });
      setResult(res.data);
      setCart([]);
      setCustomer({ customerName: '', customerEmail: '', customerPhone: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate quotation');
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0D2B4E', margin: 0 }}>
            Create Quotation
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
            Select products, add customer details, and download a professional PDF quotation
          </p>
        </div>

        {error && (
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#B91C1C',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '13px',
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
            gap: '20px',
          }}
        >
          {/* Products */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0D2B4E', margin: 0 }}>
                Products Catalog ({filtered.length})
              </h2>
              <input
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#0D2B4E',
                  background: '#F8FAFC',
                  outline: 'none',
                  fontFamily: 'inherit',
                  minWidth: '200px',
                }}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '12px',
              }}
            >
              {filtered.map((p) => (
                <div
                  key={p.id}
                  onClick={() => addToCart(p)}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #F1F5F9',
                    padding: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(13, 43, 78, 0.06)',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 136, 229, 0.15)';
                    e.currentTarget.style.borderColor = '#4FC3F7';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(13, 43, 78, 0.06)';
                    e.currentTarget.style.borderColor = '#F1F5F9';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      aspectRatio: '1',
                      background: '#F7FAFF',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                    }}
                  >
                    {p.imageUrl ? (
                      <img
                        src={`${UPLOADS_URL}${p.imageUrl}`}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                          color: '#CBD5E1',
                        }}
                      >
                        📦
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0D2B4E',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#1E88E5',
                      marginTop: '2px',
                    }}
                  >
                    KES {Number(p.price).toLocaleString()}
                  </div>
                  {p.vat && (
                    <div
                      style={{
                        fontSize: '10px',
                        color: '#1E40AF',
                        background: '#DBEAFE',
                        padding: '2px 6px',
                        borderRadius: '999px',
                        fontWeight: 700,
                        display: 'inline-block',
                        marginTop: '4px',
                      }}
                    >
                      VAT
                    </div>
                  )}
                </div>
              ))}
              {filtered.length === 0 && (
                <p
                  style={{
                    color: '#94a3b8',
                    textAlign: 'center',
                    gridColumn: '1 / -1',
                    padding: '40px',
                  }}
                >
                  No products found. Add products first from the Products page.
                </p>
              )}
            </div>
          </div>

          {/* Cart */}
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              border: '1px solid #F1F5F9',
              padding: '20px',
              height: 'fit-content',
              position: 'sticky',
              top: '80px',
              boxShadow: '0 1px 3px rgba(13, 43, 78, 0.06)',
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#0D2B4E',
                marginBottom: '16px',
              }}
            >
              Cart ({cart.length})
            </h2>

            {cart.length === 0 ? (
              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '13px',
                  textAlign: 'center',
                  padding: '20px 0',
                }}
              >
                Click products to add them.
              </p>
            ) : (
              <ul style={{ listStyle: 'none', marginBottom: '16px', padding: 0 }}>
                {cart.map((c) => (
                  <li
                    key={c.id}
                    style={{
                      padding: '10px 0',
                      borderBottom: '1px solid #F1F5F9',
                      fontSize: '13px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: '#0D2B4E' }}>{c.name}</div>
                      <button
                        onClick={() => removeFromCart(c.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#DC2626',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => updateQty(c.id, c.quantity - 1)}
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '4px',
                            background: '#F1F5F9',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 700,
                          }}
                        >
                          −
                        </button>
                        <span style={{ minWidth: '20px', textAlign: 'center' }}>
                          {c.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(c.id, c.quantity + 1)}
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '4px',
                            background: '#F1F5F9',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 700,
                          }}
                        >
                          +
                        </button>
                      </div>
                      <div style={{ color: '#1E88E5', fontWeight: 700 }}>
                        KES {(Number(c.price) * c.quantity).toLocaleString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', fontSize: '13px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}
              >
                <span style={{ color: '#64748b' }}>Subtotal</span>
                <span style={{ color: '#0D2B4E', fontWeight: 600 }}>
                  KES {subtotal.toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <span style={{ color: '#64748b' }}>VAT (16%)</span>
                <span style={{ color: '#0D2B4E', fontWeight: 600 }}>
                  KES {vatAmount.toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '2px solid #0D2B4E',
                }}
              >
                <span style={{ color: '#0D2B4E', fontWeight: 800, fontSize: '15px' }}>
                  TOTAL
                </span>
                <span style={{ color: '#1E88E5', fontWeight: 800, fontSize: '17px' }}>
                  KES {total.toFixed(2)}
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <input
                placeholder="Customer Name"
                value={customer.customerName}
                onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })}
                style={{
                  padding: '10px 12px',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#0D2B4E',
                  background: '#F8FAFC',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <input
                placeholder="Customer Email"
                value={customer.customerEmail}
                onChange={(e) => setCustomer({ ...customer, customerEmail: e.target.value })}
                style={{
                  padding: '10px 12px',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#0D2B4E',
                  background: '#F8FAFC',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <input
                placeholder="Customer Phone"
                value={customer.customerPhone}
                onChange={(e) => setCustomer({ ...customer, customerPhone: e.target.value })}
                style={{
                  padding: '10px 12px',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#0D2B4E',
                  background: '#F8FAFC',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={submit}
                disabled={saving || cart.length === 0}
                style={{
                  background: saving || cart.length === 0 ? '#94a3b8' : '#1E88E5',
                  color: '#fff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: saving || cart.length === 0 ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  marginTop: '4px',
                }}
              >
                {saving ? 'Generating…' : 'Generate Quotation'}
              </button>
            </div>

            {result && (
              <div
                style={{
                  marginTop: '16px',
                  background: '#DCFCE7',
                  border: '1px solid #86EFAC',
                  borderRadius: '10px',
                  padding: '14px',
                  fontSize: '13px',
                }}
              >
                <div style={{ fontWeight: 800, color: '#166534', marginBottom: '8px' }}>
                  ✅ Quotation Generated
                </div>
                <div style={{ color: '#166534', fontSize: '12px', marginBottom: '10px' }}>
                  <b>Serial:</b> {result.serialNumber}
                  <br />
                  <b>Total:</b> KES {Number(result.total).toLocaleString()}
                </div>
                {result.pdfUrl && (
                  <a
                    href={`http://localhost:5000${result.pdfUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'block',
                      background: '#0D2B4E',
                      color: '#fff',
                      textDecoration: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      marginBottom: '8px',
                    }}
                  >
                    📄 Download PDF
                  </a>
                )}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6px',
                  }}
                >
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Quotation ${result.serialNumber} — KES ${result.total}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: '#2E7D32',
                      color: '#fff',
                      textDecoration: 'none',
                      padding: '8px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    💬 WhatsApp
                  </a>
                  <a
                    href={`mailto:${customer.customerEmail}?subject=Quotation ${result.serialNumber}&body=Total: KES ${result.total}`}
                    style={{
                      background: '#4FC3F7',
                      color: '#0D2B4E',
                      textDecoration: 'none',
                      padding: '8px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    ✉️ Email
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}