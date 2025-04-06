import React from 'react';
import Button from '../ui/Button';

export default function LowStockAlerts() {
  // Static mock data for low stock medications
  const lowStockMedications = [
    { name: 'Lisinopril', quantity: 5 },
    { name: 'Warfarin', quantity: 2 },
    { name: 'Prednisone', quantity: 3 },
    { name: 'Simvastatin', quantity: 4 },
  ];

  return (
    <div className="p-4 bg-[#7d9eeb]/25 hover:bg-[#7d9eeb]/30 rounded-lg shadow-lg transition-all duration-200">
      <h2 className="text-xl font-bold mb-2 text-gray-800">Low Stock Alerts</h2>
      <p className="text-gray-600 text-sm mb-4">
        The following medications are running low. Consider restocking.
      </p>

      <div className="space-y-2">
        {lowStockMedications.map((med, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-white/50 rounded-md">
            <span className="text-gray-700 font-medium">{med.name}</span>
            <span className="text-red-500 font-bold">Stock: {med.quantity}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={() => alert('Order request sent! (Mock)')}
          className="w-full py-2 px-4 bg-[#7d9eeb] hover:bg-[#6b8ad8] text-white font-medium rounded-full transition-colors duration-200"
        >
          Order More
        </button>
      </div>
    </div>
  );
}