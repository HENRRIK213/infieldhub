'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLive, setIsLive] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLogs = async () => {
    try {
      const res = await api.get(`/logs?t=${Date.now()}`);
      setLogs(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch logs", err);
      setLoading(false);
    }
  };

  // Initial Fetch and Real-Time Polling
  useEffect(() => {
    fetchLogs();
    
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        fetchLogs();
      }, 5000); // Fetches new logs every 5 seconds
    }

    return () => clearInterval(interval);
  }, [isLive]);

  // Export to CSV Function
  const downloadCSV = () => {
    if (logs.length === 0) return;
    const headers = ['Time', 'User', 'Action', 'Details', 'Severity'];
    const csvRows = logs.map(log => [
      new Date(log.createdAt).toLocaleString(),
      log.userName || 'System',
      log.action,
      log.details,
      log.severity
    ]);
    
    const csvContent = [headers, ...csvRows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `system_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering
  const filteredLogs = logs.filter(log => 
    log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  // Severity Badge Colors
  const getSeverityStyle = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH':
      case 'CRITICAL':
        return { bg: '#FEE2E2', color: '#B91C1C' };
      case 'MEDIUM':
      case 'WARNING':
        return { bg: '#FEF3C7', color: '#B45309' };
      case 'LOW':
      case 'INFO':
      default:
        return { bg: '#DBEAFE', color: '#1E40AF' };
    }
  };

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px', background: '#F1F5F9', minHeight: '100vh' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0D2B4E', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 32 }}>📋</span> System Activity Logs
              
              {/* Live Indicator */}
              <div 
                onClick={() => setIsLive(!isLive)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: isLive ? '#DCFCE7' : '#F1F5F9', padding: '4px 12px', borderRadius: 20, cursor: 'pointer', border: '1px solid', borderColor: isLive ? '#86EFAC' : '#CBD5E1' }}
              >
                <div style={{ width: 8, height: 8, borderRadius: 4, background: isLive ? '#22C55E' : '#94A3B8', animation: isLive ? 'pulse 2s infinite' : 'none' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: isLive ? '#166534' : '#64748B' }}>{isLive ? 'LIVE' : 'PAUSED'}</span>
              </div>
            </h1>
            <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>Audit trail of all security and system events.</p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <input 
              type="text" 
              placeholder="Search actions, users..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{ padding: '12px 20px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, width: 250, outline: 'none' }}
            />
            <button onClick={downloadCSV} style={{ background: '#0D2B4E', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Download CSV
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                  <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Time</th>
                  <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>User</th>
                  <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Action</th>
                  <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Details</th>
                  <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Severity</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading logs...</td></tr>
                ) : currentLogs.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>No logs found.</td></tr>
                ) : (
                  currentLogs.map((log, idx) => {
                    const sevStyle = getSeverityStyle(log.severity);
                    return (
                      <tr key={log.id || idx} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}>
                        <td style={{ padding: '16px 24px', fontSize: 14, color: '#475569', whiteSpace: 'nowrap' }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: '#0F172A' }}>
                          {log.userName || 'System'}
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: 14, color: '#0D2B4E', fontWeight: 700 }}>
                          {log.action}
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748B', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.details}>
                          {log.details || '-'}
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ background: sevStyle.bg, color: sevStyle.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>
                            {log.severity || 'INFO'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
            <span style={{ fontSize: 14, color: '#64748B' }}>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLogs.length)} of {filteredLogs.length} entries
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #CBD5E1', background: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages || totalPages === 0}
                style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #CBD5E1', background: '#fff', cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1 }}
              >
                Next
              </button>
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
