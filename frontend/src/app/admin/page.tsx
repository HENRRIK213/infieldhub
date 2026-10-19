'use client';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 10px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Dashboard</h1>
        </div>

        {/* TOP GRID: 3 Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 20 }}>
          
          {/* Panel 1: Estimates Dashboard */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0D2B4E', margin: '0 0 16px 0' }}>Estimates/Quotes Dashboard</h2>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <Link href="/admin/documents" style={{ flex: 1, background: '#1E88E5', color: '#fff', padding: '10px 0', textAlign: 'center', borderRadius: 6, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Create Quote</Link>
              <button style={{ flex: 1, background: '#fff', color: '#1E88E5', border: '1px solid #1E88E5', padding: '10px 0', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>Send Quote</button>
            </div>
            
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E' }}>Client Name</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Draft: #ED451</div>
            </div>

            <div style={{ border: '1px solid #f1f5f9', borderRadius: 8, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E' }}>Pending Model X (a-tount)</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Quote #1203</div>
              </div>
              <span style={{ color: '#94a3b8', fontSize: 18 }}>›</span>
            </div>
          </div>

          {/* Panel 2: Save as Draft */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E' }}>Save as Draft</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ background: '#1E88E5', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>Send</button>
                <button style={{ background: '#e2e8f0', color: '#0D2B4E', border: 'none', padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>Approve</button>
              </div>
            </div>
            
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0D2B4E', marginBottom: 16 }}>Draft #ED451 for Solar Array</div>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', marginBottom: 16 }}>
                <thead>
                  <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                    <th style={{ paddingBottom: 8 }}>Description</th>
                    <th style={{ paddingBottom: 8 }}>Qty</th>
                    <th style={{ paddingBottom: 8 }}>Price</th>
                    <th style={{ paddingBottom: 8, textAlign: 'right' }}>Sub-Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px 0' }}>Panel Installation</td>
                    <td>1</td>
                    <td>$15.00</td>
                    <td style={{ textAlign: 'right' }}>$250.00</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0' }}>Inverter Model X</td>
                    <td>1</td>
                    <td>$30.00</td>
                    <td style={{ textAlign: 'right' }}>$450.00</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#0D2B4E' }}>
                <span>Sub-Total</span>
                <span>$350.00</span>
              </div>
            </div>
            
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Select the Line-item Template:</div>
              <select style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13, background: '#fff' }}>
                <option>Select Existing Line-item Template</option>
              </select>
            </div>
          </div>

          {/* Panel 3: Invoicing Status Tracker */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0D2B4E', margin: '0 0 16px 0' }}>Invoicing Status Tracker</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E' }}>Estimates</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Sent and accepted</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1E88E5' }}>18</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E' }}>Approved</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Pending conversion</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>10</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E' }}>Invoices</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Sent and paid</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>5</div>
              </div>
            </div>
            
            <div style={{ marginTop: 24, border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 12 }}>Aging: Receivables Over time</div>
              <svg viewBox="0 0 100 40" style={{ width: '100%', height: 60 }}>
                <path d="M0,40 L10,35 L30,20 L50,25 L70,10 L100,5 L100,40 Z" fill="#DBEAFE" stroke="#1E88E5" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* BOTTOM GRID: 3 Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          
          {/* Panel 4: Estimates Table */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Estimates/Quotes Dashboard</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ background: '#1E88E5', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>Create Quote</button>
                <button style={{ background: '#fff', color: '#1E88E5', border: '1px solid #1E88E5', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>Send Quote</button>
              </div>
            </div>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ paddingBottom: 8 }}>Client Name</th>
                  <th style={{ paddingBottom: 8 }}>Quote ID</th>
                  <th style={{ paddingBottom: 8 }}>Date</th>
                  <th style={{ paddingBottom: 8 }}>Amount</th>
                  <th style={{ paddingBottom: 8 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '8px 0' }}>Client Name</td><td>#ED451</td><td>06/2022</td><td>$250.00</td><td><span style={{ color: '#f59e0b', background: '#fef3c7', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>Draft</span></td></tr>
                <tr><td style={{ padding: '8px 0' }}>Client Name</td><td>#ED452</td><td>06/2022</td><td>$250.00</td><td><span style={{ color: '#f59e0b', background: '#fef3c7', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>Draft</span></td></tr>
                <tr><td style={{ padding: '8px 0' }}>Client Name</td><td>#ED453</td><td>06/2022</td><td>$250.00</td><td><span style={{ color: '#1E88E5', background: '#dbeafe', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>Sent</span></td></tr>
                <tr><td style={{ padding: '8px 0' }}>Jotan Alex</td><td>#ED454</td><td>06/2022</td><td>$250.00</td><td><span style={{ color: '#8b5cf6', background: '#ede9fe', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>Viewed</span></td></tr>
                <tr><td style={{ padding: '8px 0' }}>Jotan Haven</td><td>#ED450</td><td>06/2022</td><td>$280.00</td><td><span style={{ color: '#10b981', background: '#d1fae5', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>Accepted</span></td></tr>
              </tbody>
            </table>
          </div>

          {/* Panel 5: Client Signature */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0D2B4E', margin: '0 0 16px 0' }}>Client Signature & Acceptance</h2>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>View accepted quotes of accepted estimate and T&Cs.</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>📄</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0D2B4E' }}>Job Completion Form</div>
                    <div style={{ fontSize: 11, color: '#1E88E5' }}>Create: Completion Form</div>
                  </div>
                </div>
                <span style={{ color: '#94a3b8' }}>›</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>📸</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0D2B4E' }}>Photolinks</div>
                    <div style={{ fontSize: 11, color: '#1E88E5' }}>Create: Completion Form</div>
                  </div>
                </div>
                <span style={{ color: '#94a3b8' }}>›</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>🖋️</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0D2B4E' }}>Client Signature</div>
                  </div>
                </div>
                <span style={{ color: '#94a3b8' }}>›</span>
              </div>
            </div>
            
            <div style={{ marginTop: 20, border: '1px dashed #cbd5e1', borderRadius: 8, padding: 20, textAlign: 'center' }}>
              <div style={{ fontFamily: 'cursive', fontSize: 24, color: '#0D2B4E' }}>Alex Juma</div>
            </div>
          </div>

          {/* Panel 6: Recent Invoices */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0D2B4E', margin: '0 0 16px 0' }}>Recent Invoices & Conversions</h2>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ paddingBottom: 8 }}>Invoice</th>
                  <th style={{ paddingBottom: 8 }}>Date</th>
                  <th style={{ paddingBottom: 8 }}>Paid</th>
                  <th style={{ paddingBottom: 8 }}>Due</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '8px 0', color: '#1E88E5', fontWeight: 700 }}>#ED451</td><td>06/2022</td><td>$280.00</td><td><span style={{ color: '#10b981', background: '#d1fae5', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>Feb 03</span></td></tr>
                <tr><td style={{ padding: '8px 0', color: '#1E88E5', fontWeight: 700 }}>#ED450</td><td>06/2022</td><td>$250.00</td><td><span style={{ color: '#10b981', background: '#d1fae5', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>Feb 03</span></td></tr>
                <tr><td style={{ padding: '8px 0', color: '#1E88E5', fontWeight: 700 }}>#ED453</td><td>06/2022</td><td>$250.00</td><td><span style={{ color: '#10b981', background: '#d1fae5', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>Feb 03</span></td></tr>
                <tr><td style={{ padding: '8px 0', color: '#1E88E5', fontWeight: 700 }}>#ED452</td><td>06/2022</td><td>$290.00</td><td style={{ color: '#64748b', fontSize: 11 }}>Record Payment</td></tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </Layout>
  );
}
