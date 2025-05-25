// BillingSummary.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function TransactionCard({ transaction }) {
  const { date, description, amount, status } = transaction;
  const location = useLocation();
  const isWalletView = location.pathname === '/wallet';

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'available':
        return 'text-[#1d5b91] bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  return (
    <div className={`block p-6 ${isWalletView ? 'bg-white' : 'bg-[#7d9eeb]/25 hover:bg-[#7d9eeb]/30'} rounded-lg shadow-lg transition-all duration-200 hover:no-underline`}>
      <h2 className="text-xl font-bold mb-1 text-gray-800">Wallet</h2>
      <p className="text-2xl font-bold text-black mb-4">${amount.toFixed(2)}</p>
      <div className="flex justify-between items-center">
        <p className="text-gray-700 font-medium">{formatDate(date)}</p>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
    </div>
  );
}