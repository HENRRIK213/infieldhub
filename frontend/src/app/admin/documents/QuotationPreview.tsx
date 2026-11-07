import React from 'react';

export default function QuotationPreview() {
  const today = new Date().toLocaleDateString('en-GB'); 

  return (
    <div className="bg-white p-8 md:p-12 shadow-lg max-w-3xl mx-auto w-full text-sm font-sans text-gray-800">
      
      {/* 1. HEADER SECTION */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <img src="/logo" alt="inField Logo" className="h-16 mb-2 object-contain" />
          <p className="text-xs text-gray-500 leading-relaxed">
            P.O BOX 62700-19052, Meru Township<br />
            <span className="text-blue-600">0701243548</span>
          </p>
        </div>
        <div className="text-right">
          <img src="/solar-default" alt="Solar Array" className="h-24 ml-auto mb-2 object-contain" />
          <p className="font-bold text-xs">{today}</p>
          <p className="text-xs text-gray-500">Serial: QU-2026-1234</p>
        </div>
      </div>

      {/* 2. TITLE */}
      <div className="text-center mb-10">
        <h1 className="text-lg font-extrabold text-[#0a1f44] uppercase tracking-wide inline-block border-b-2 border-[#0a1f44] pb-1">
          QUOTATION FOR SUPPLY AND INSTALLATION
        </h1>
      </div>

      {/* 3. RECIPIENT */}
      <div className="mb-8">
        <p className="font-bold mb-4">To: THE CLIENT</p>
        <p className="mb-2">Dear Sir/Madam,</p>
        <p className="leading-relaxed text-justify">
          We are grateful for your inquiry concerning the above subject matter. We are now pleased to forward our quote, terms & conditions to you.
        </p>
      </div>

      {/* 4. ITEMS TABLE */}
      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-800 text-[#0a1f44] text-left">
            <th className="py-2 font-bold uppercase text-xs w-1/2">Description</th>
            <th className="py-2 font-bold uppercase text-xs text-center">Qty</th>
            <th className="py-2 font-bold uppercase text-xs text-center">VAT</th>
            <th className="py-2 font-bold uppercase text-xs text-right">Unit Price</th>
            <th className="py-2 font-bold uppercase text-xs text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-4"></td>
            <td className="py-4"></td>
            <td className="py-4"></td>
            <td className="py-4"></td>
            <td className="py-4"></td>
          </tr>
        </tbody>
      </table>

      {/* 5. TOTALS */}
      <div className="flex justify-end mb-12">
        <div className="w-1/2 md:w-1/3">
          <div className="flex justify-between py-1">
            <span className="font-bold text-xs uppercase">Subtotal</span>
            <span className="text-xs">0</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-bold text-xs uppercase">VAT (16%)</span>
            <span className="text-xs">0</span>
          </div>
          <div className="flex justify-between py-2 border-t-2 border-gray-800 mt-1">
            <span className="font-extrabold text-sm uppercase text-[#0a1f44]">Total KES</span>
            <span className="font-extrabold text-sm text-[#0a1f44]">0</span>
          </div>
        </div>
      </div>

      {/* 6. TERMS */}
      <div className="mb-12">
        <h2 className="font-bold text-[#0a1f44] text-xs mb-2 uppercase">Terms & Conditions:</h2>
        <div className="text-[10px] text-gray-600 space-y-1">
          <p>Delivery: EX STOCK SUBJECT TO PRIOR SALES.</p>
          <p>Validity: THIS PRICE VALID FOR 1 WEEK.</p>
          <p>Payment: IN FULL PRIOR TO SUPPLY.</p>
        </div>
      </div>

      {/* 7. FOOTER */}
      <div className="flex justify-between items-end mt-16 pt-8 border-t border-gray-200">
        <div className="border border-gray-800 rounded p-4 w-2/3 mr-4">
          <h3 className="text-center font-bold text-[11px] uppercase mb-4">Payment Options</h3>
          <div className="flex justify-between text-[9px] text-center leading-tight">
            <div className="w-1/3 px-1 flex flex-col items-center">
              <img src="/payment-logos/kingdom-bank" alt="Kingdom Bank" className="h-8 mb-2 object-contain" />
              <p className="font-bold uppercase mb-1">Kingdom Bank</p>
              <p>Name: Infield Engineering Company</p>
              <p>Acc No: 5021964795002</p>
              <p>Bank Code: 01103043839002</p>
            </div>
            <div className="w-1/3 px-1 border-x border-gray-200 flex flex-col items-center">
              <img src="/payment-logos/coop-bank" alt="Co-operative Bank" className="h-8 mb-2 object-contain" />
              <p className="font-bold uppercase mb-1">Co-operative Bank</p>
              <p>Business Name: 1170535</p>
              <p>Acc No: 400200</p>
            </div>
            <div className="w-1/3 px-1 flex flex-col items-center">
              <img src="/payment-logos/mpesa" alt="M-PESA" className="h-8 mb-2 object-contain" />
              <p className="font-bold uppercase mb-1">M-Pesa</p>
              <p>Paybill: 247247</p>
              <p>Acc: 0701243548</p>
            </div>
          </div>
        </div>

        <div className="w-1/3 flex flex-col items-end">
          <div className="w-full border-b border-gray-400 mb-2 h-10"></div>
          <p className="text-xs text-gray-500 mb-6">Name</p>
          <div className="w-full border-b border-gray-400 mb-2 h-10"></div>
          <p className="text-xs text-gray-500 mb-2">Date</p>
          <p className="font-script text-2xl text-[#0a1f44] italic mt-2">Alphonce Juma</p>
          <p className="text-[9px] font-bold uppercase mt-1">Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
}
