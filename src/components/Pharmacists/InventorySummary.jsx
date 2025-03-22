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
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">Inventory Summary</h2>
      <ul className="space-y-1">
        {inventory.map((med, index) => (
          <li key={index} className="flex justify-between text-gray-700">
            <span>{med.name}</span>
            <span className="font-semibold">{med.stock}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}