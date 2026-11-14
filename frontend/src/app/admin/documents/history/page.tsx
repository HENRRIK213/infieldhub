"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, FileText, Download, Eye, Filter, AlertCircle, RefreshCw } from "lucide-react";

export default function DocumentHistoryPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  // 🟢 FETCH REAL DATA FROM BACKEND
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // REPLACE WITH YOUR ACTUAL API ENDPOINT
        // const res = await api.get('/documents'); 
        // setDocuments(res.data);
        
        // For now, we simulate an empty successful fetch to show the professional empty state
        setDocuments([]); 
        setError("");
      } catch (err) {
        console.error("Failed to fetch documents", err);
        setError("Unable to connect to the database. Please check your backend.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  // Filter logic
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.serialNo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Paid': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Paid</span>;
      case 'Sent': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Sent</span>;
      case 'Draft': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">Draft</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-[#f4f7f9] min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Document History</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your quotations, invoices, and reports in one place.</p>
        </div>
        <Link 
          href="/admin/documents" 
          className="mt-4 md:mt-0 flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition"
        >
          <Plus className="w-4 h-4 mr-2" /> Create New Document
        </Link>
      </div>

      {/* ERROR BANNER (Only shows if backend fails) */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* MAIN TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* TOOLBAR (Search & Filter) */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by client or serial no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Filter className="w-5 h-5 text-gray-400" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All">All Types</option>
              <option value="Quotation">Quotations</option>
              <option value="Invoice">Invoices</option>
              <option value="Report">Reports</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold">Serial No</th>
                <th className="p-4 font-semibold">Document Type</th>
                <th className="p-4 font-semibold">Client Name</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Total (KSH)</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
                    Loading documents...
                  </td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                /* PROFESSIONAL EMPTY STATE */
                <tr>
                  <td colSpan={7} className="p-16 text-center">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">No documents found</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {searchTerm || filterType !== "All" 
                        ? "Try adjusting your search or filters." 
                        : "You haven't created any quotations or invoices yet."}
                    </p>
                    {(!searchTerm && filterType === "All") && (
                      <Link href="/admin/documents" className="text-blue-600 font-medium text-sm hover:underline">
                        Create your first document &rarr;
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-blue-50/50 transition group">
                    <td className="p-4 text-sm font-bold text-gray-800">{doc.serialNo}</td>
                    <td className="p-4 text-sm text-gray-600 flex items-center">
                       <FileText className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-500 transition" />
                       {doc.type}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-800">{doc.clientName}</td>
                    <td className="p-4 text-sm text-gray-500">{doc.date}</td>
                    <td className="p-4 text-sm font-bold text-gray-800">{Number(doc.total).toLocaleString()}</td>
                    <td className="p-4">{getStatusBadge(doc.status)}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Document">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="Download PDF">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
