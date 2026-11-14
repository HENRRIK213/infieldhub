"use client";

export default function AdminDashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500">Your original system layout has been restored.</p>
        <p className="text-sm text-gray-400 mt-4">Use the sidebar to navigate to Payments, PDF Generator, Products, etc.</p>
      </div>
    </div>
  );
}
