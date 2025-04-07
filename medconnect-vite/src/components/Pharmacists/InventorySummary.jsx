// src/components/Pharmacists/InventorySummary.jsx
import React from 'react';

export default function InventorySummary() {
  // Static inventory data for now
  const inventory = [
    { name: "Amoxicillin", stock: 120 },
    { name: "Ibuprofen", stock: 60 },
    { name: "Metformin", stock: 30 },
  ];

  return (
    <div className="p-4 bg-[#6bb7b7]/25 hover:bg-[#6bb7b7]/30 rounded-lg shadow-lg transition-all duration-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Inventory Summary</h2>
      <div className="space-y-3">
        {inventory.map((med, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-white/50 rounded-md">
            <span className="text-gray-700 font-medium">{med.name}</span>
            <span className="text-xl font-bold text-gray-800">{med.stock}</span>
          </div>
        ))}
      </div>
    </div>
  );
}