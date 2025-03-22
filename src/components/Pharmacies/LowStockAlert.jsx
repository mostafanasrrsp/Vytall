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
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-2">Low Stock Alerts</h2>
      <p className="text-gray-500 text-sm mb-4">
        The following medications are running low. Consider restocking.
      </p>

      <div className="space-y-2">
        {lowStockMedications.map((med, index) => (
          <div key={index} className="flex justify-between items-center p-2 border rounded-md">
            <span className="text-gray-800 font-medium">{med.name}</span>
            <span className="text-[#d9534f] font-bold">Stock: {med.quantity}</span>
          </div>
        ))}
      </div>

      {/* Mock Order More Button */}
      <div className="mt-4 text-center">
        <Button
          onClick={() => alert('Order request sent! (Mock)')}
          variant="primary"
          fullWidth
        >
          Order More
        </Button>
      </div>
    </div>
  );
}