"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Send, CheckCircle, Clock, XCircle, Search, X, Smartphone, Building2, ShieldCheck, ArrowLeft } from "lucide-react";

export default function AdminPaymentsPage() {
  const [isLive, setIsLive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promptData, setPromptData] = useState({ phone: "", amount: "", account: "M-Pesa" });
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 🟢 REAL-TIME FETCHING LOGIC
  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      // 🔴 REPLACE THIS WITH YOUR ACTUAL BACKEND CALL:
      // const res = await api.get('/payments');
      // setPayments(res.data);
    } catch (error) {
      console.error("Failed to fetch live payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        fetchPayments();
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    setTimeout(() => {
      const newPayment = {
        id: `TXN-${Math.floor(Math.random() * 90000) + 10000}`,
        phone: promptData.phone,
        amount: Number(promptData.amount),
        status: "Pending",
        date: "Just now",
        method: promptData.account
      };
      
      setPayments([newPayment, ...payments]);
      setIsSending(false);
      setIsSuccess(true);
    }, 2000);
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setPromptData({ phone: "", amount: "", account: "M-Pesa" });
      setIsSuccess(false);
    }, 300);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 bg-[#f4f7f9] min-h-screen relative">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          {/* PROFESSIONAL BACK TO DASHBOARD BUTTON */}
          <Link 
            href="/admin/dashboard" 
            className="p-2.5 text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition shadow-sm group" 
            title="Return to Admin Dashboard"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Payment Gateway</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor live transactions and push payment prompts securely.</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${isLive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-300'}`}
          >
            <span className={`w-2.5 h-2.5 rounded-full mr-2 ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            {isLive ? 'Live Sync Active' : 'Live Sync Paused'}
          </button>
          
          <button 
            onClick={fetchPayments}
            className="p-2.5 text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition"
            title="Refresh manually"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition"
          >
            <Send className="w-4 h-4 mr-2" />
            New Prompt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: TABLES */}
        <div className="xl:col-span-3 space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">Live Transaction Ledger</h2>
              <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full flex items-center">
                 <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-1.5 animate-pulse"></div> Auto-updating
              </span>
            </div>

            {payments.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <ShieldCheck className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">No transactions recorded</h3>
                <p className="text-gray-500 text-sm max-w-sm mb-6">Click "New Prompt" to initiate a secure payment request via M-Pesa or Bank.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Transaction ID</th>
                      <th className="p-4 font-semibold">Destination</th>
                      <th className="p-4 font-semibold">Customer Phone</th>
                      <th className="p-4 font-semibold">Amount (KES)</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-blue-50/50 transition">
                        <td className="p-4 text-sm font-medium text-gray-800">{pay.id}</td>
                        <td className="p-4 text-sm text-gray-600">{pay.method}</td>
                        <td className="p-4 text-sm text-gray-600">{pay.phone}</td>
                        <td className="p-4 text-sm font-bold text-gray-800">{pay.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            pay.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                            pay.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {pay.status === 'Paid' && <CheckCircle className="w-3.5 h-3.5 mr-1" />}
                            {pay.status === 'Pending' && <Clock className="w-3.5 h-3.5 mr-1" />}
                            {pay.status === 'Failed' && <XCircle className="w-3.5 h-3.5 mr-1" />}
                            {pay.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">{pay.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Invoices & Conversions</h2>
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
               <p className="text-gray-500 text-sm">No recent invoices found.</p>
               <p className="text-xs text-gray-400 mt-1">Invoices created in the Invoicing tab will appear here.</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TRACKER */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Invoicing Status Tracker</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-gray-700">Estimates</span>
                  <span className="text-xl font-bold text-gray-800">18</span>
                </div>
                <p className="text-xs text-gray-500">Sent and accepted</p>
              </div>
              <div className="p-4 bg-green-50/50 rounded-xl border border-green-100 hover:shadow-md transition cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-green-700">Approved</span>
                  <span className="text-xl font-bold text-green-700">10</span>
                </div>
                <p className="text-xs text-green-600">Pending conversion</p>
              </div>
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 hover:shadow-md transition cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-blue-700">Invoices</span>
                  <span className="text-xl font-bold text-blue-700">5</span>
                </div>
                <p className="text-xs text-blue-600">Sent and paid</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 PROFESSIONAL PAYMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">Secure Payment Request</h3>
              </div>
              <button onClick={closeAndResetModal} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {isSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Prompt Sent Successfully</h3>
                <p className="text-sm text-gray-500">
                  A payment request for <strong>KES {Number(promptData.amount).toLocaleString()}</strong> has been sent to <strong>{promptData.phone}</strong> via {promptData.account}.
                </p>
                <div className="pt-4">
                  <button onClick={closeAndResetModal} className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition">
                    Close & View Ledger
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendPrompt} className="p-6 space-y-5">
                
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">1. Select Destination Account</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => setPromptData({...promptData, account: 'M-Pesa'})} className={`py-3 px-2 rounded-lg border flex flex-col items-center justify-center space-y-1 transition ${promptData.account === 'M-Pesa' ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                      <Smartphone className="w-5 h-5" />
                      <span className="text-xs font-bold">M-Pesa</span>
                    </button>
                    <button type="button" onClick={() => setPromptData({...promptData, account: 'Kingdom Bank'})} className={`py-3 px-2 rounded-lg border flex flex-col items-center justify-center space-y-1 transition ${promptData.account === 'Kingdom Bank' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                      <Building2 className="w-5 h-5" />
                      <span className="text-xs font-bold text-center leading-tight">Kingdom<br/>Bank</span>
                    </button>
                    <button type="button" onClick={() => setPromptData({...promptData, account: 'Co-op Bank'})} className={`py-3 px-2 rounded-lg border flex flex-col items-center justify-center space-y-1 transition ${promptData.account === 'Co-op Bank' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                      <Building2 className="w-5 h-5" />
                      <span className="text-xs font-bold text-center leading-tight">Co-op<br/>Bank</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">2. Customer Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Smartphone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="tel" 
                      placeholder="e.g. 0712345678" 
                      required
                      value={promptData.phone}
                      onChange={(e) => setPromptData({...promptData, phone: e.target.value})}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">3. Amount to Request (KES)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm font-semibold">KES</span>
                    </div>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      required
                      value={promptData.amount}
                      onChange={(e) => setPromptData({...promptData, amount: e.target.value})}
                      className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                <div className="pt-2 flex space-x-3">
                  <button type="button" onClick={closeAndResetModal} className="flex-1 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSending} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-sm flex justify-center items-center">
                    {isSending ? (
                      <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                    ) : (
                      "Send Prompt"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
