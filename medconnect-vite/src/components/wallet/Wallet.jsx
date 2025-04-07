// src/components/wallet/Wallet.jsx
import React from 'react';
import TransactionCard from './TransactionCard';
import { useAuth } from '../../login/AuthContext';

export default function Wallet() {
  const { user } = useAuth();
  const transactions = [
    {
      id: 1,
      date: '2024-03-01',
      description: 'Medical Consultation',
      amount: 150.00,
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-03-15',
      description: 'Prescription Medication',
      amount: 75.50,
      status: 'pending'
    }
  ];

  const walletBalance = 500.00; // This will come from your API

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Wallet</h2>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Available Balance</p>
              <p className="text-3xl font-bold text-[#1d5b91]">${walletBalance.toFixed(2)}</p>
            </div>
            <button className="bg-[#2978b5] text-white px-6 py-2 rounded-full hover:bg-[#1d5b91] transition-colors">
              Add Funds
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Recent Transactions</h3>
          <button className="text-[#2978b5] hover:text-[#1d5b91]">View All</button>
        </div>
        <div className="space-y-4">
          {transactions.map(transaction => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
}