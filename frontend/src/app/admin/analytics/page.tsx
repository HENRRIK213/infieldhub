'use client';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function AnalyticsPage() {
  const router = useRouter();
  const [isLive, setIsLive] = useState(true);

  const [revenueData, setRevenueData] = useState([
    { name: 'Mon', revenue: 45000 }, { name: 'Tue', revenue: 52000 },
    { name: 'Wed', revenue: 48000 }, { name: 'Thu', revenue: 61000 },
    { name: 'Fri', revenue: 55000 }, { name: 'Sat', revenue: 67000 },
    { name: 'Sun', revenue: 72000 },
  ]);

  const [salesData, setSalesData] = useState([
    { name: 'Pumps', sales: 120 }, { name: 'Motors', sales: 98 },
    { name: 'Cables', sales: 156 }, { name: 'Panels', sales: 85 },
    { name: 'Inverters', sales: 45 },
  ]);

  const [threatData, setThreatData] = useState([
    { name: 'Brute Force', value: 45 },
    { name: 'SQL Injection', value: 12 },
    { name: 'Malware', value: 8 },
    { name: 'Unauthorized API', value: 30 },
  ]);

  const [pdfData, setPdfData] = useState([
    { name: 'Quotations', count: 80 },
    { name: 'Invoices', count: 45 },
    { name: 'Reports', count: 20 },
  ]);

  // Real-Time Simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        
        setRevenueData(prev => prev.map(item => ({
          ...item,
          revenue: Math.max(0, item.revenue + Math.floor(Math.random() * 5000) - 2500)
        })));

        setSalesData(prev => prev.map(item => ({
          ...item,
          sales: Math.max(0, item.sales + Math.floor(Math.random() * 10) - 5)
        })));

        // FIXED: Safely updating the threat data array without mutating state
        setThreatData(prev => {
            const randomIndex = Math.floor(Math.random() * prev.length);
            return prev.map((item, index) => 
                index === randomIndex ? { ...item, value: item.value + 1 } : item
            );
        });
        
      }, 4000); // Updates every 4 seconds
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalSales = salesData.reduce((acc, curr) => acc + curr.sales, 0);
  const totalPdfs = pdfData.reduce((acc, curr) => acc + curr.count, 0);
  const totalThreats = threatData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px', background: '#F1F5F9', minHeight: '100vh' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0D2B4E', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>📈</span> Live System Analytics
          </h1>
          
          <div 
            onClick={() => setIsLive(!isLive)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: isLive ? '#DCFCE7' : '#F1F5F9', padding: '8px 16px', borderRadius: 20, cursor: 'pointer', border: '1px solid', borderColor: isLive ? '#86EFAC' : '#CBD5E1' }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 4, background: isLive ? '#22C55E' : '#94A3B8', animation: isLive ? 'pulse 2s infinite' : 'none' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: isLive ? '#166534' : '#64748B' }}>{isLive ? 'LIVE DATA' : 'PAUSED'}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
          
          {/* Revenue Card */}
          <div onClick={() => router.push('/admin/payments')} style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #E2E8F0', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#64748B' }}>TOTAL REVENUE (KSH)</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#0D2B4E', marginTop: 8 }}>
              {totalRevenue.toLocaleString()}
            </div>
            <div style={{ height: 60, marginTop: 16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <Line type="monotone" dataKey="revenue" stroke="#00C49F" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales Card */}
          <div onClick={() => router.push('/admin/product-manager')} style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #E2E8F0', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#64748B' }}>PRODUCT SALES</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#0D2B4E', marginTop: 8 }}>
              {totalSales.toLocaleString()}
            </div>
            <div style={{ height: 60, marginTop: 16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <Bar dataKey="sales" fill="#0088FE" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PDF Generations Card */}
          <div onClick={() => router.push('/admin/documents')} style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #E2E8F0', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#64748B' }}>PDF GENERATIONS</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#0D2B4E', marginTop: 8 }}>
              {totalPdfs.toLocaleString()}
            </div>
            <div style={{ height: 60, marginTop: 16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pdfData}>
                  <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          
          {/* Security Threats Chart */}
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0D2B4E' }}>Security Threats Blocked</h2>
              <button onClick={() => router.push('/admin/logs')} style={{ fontSize: 12, fontWeight: 700, color: '#1E88E5', background: 'none', border: 'none', cursor: 'pointer' }}>View Logs →</button>
            </div>
            
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={threatData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" cy="50%" 
                    innerRadius={60} 
                    outerRadius={90} 
                    paddingAngle={5}
                    onClick={() => router.push('/admin/logs')}
                    style={{ cursor: 'pointer' }}
                  >
                    {threatData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: '#64748B' }}>
              Total Attacks Blocked: <strong style={{ color: '#B91C1C' }}>{totalThreats}</strong>
            </div>
          </div>

          {/* Interactive Sales Breakdown */}
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0D2B4E' }}>Sales by Category</h2>
              <button onClick={() => router.push('/admin/product-manager')} style={{ fontSize: 12, fontWeight: 700, color: '#1E88E5', background: 'none', border: 'none', cursor: 'pointer' }}>View Products →</button>
            </div>

            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={salesData} 
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  onClick={() => router.push('/admin/product-manager')}
                  style={{ cursor: 'pointer' }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip cursor={{ fill: '#F1F5F9' }} />
                  <Bar dataKey="sales" name="Units Sold" radius={[6, 6, 0, 0]}>
                    {salesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
      `}</style>
    </Layout>
  );
}
