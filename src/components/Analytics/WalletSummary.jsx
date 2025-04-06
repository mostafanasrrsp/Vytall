import React from 'react';
import { Link } from 'react-router-dom';
import { FaWallet } from 'react-icons/fa';

export default function WalletSummary({ balance }) {
  return (
    <Link to="/wallet" className="block">
      <div className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold flex items-center">
            <FaWallet className="mr-2 text-[#1d5b91]" />
            Current Balance
          </h2>
          <span className="text-xl font-bold text-black">${balance.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600">
          Available for medical expenses
        </p>
      </div>
    </Link>
  );
} 