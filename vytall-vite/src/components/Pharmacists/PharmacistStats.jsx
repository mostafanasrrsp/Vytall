// src/components/Pharmacists/PharmacistStats.jsx
import React from 'react';

export default function PharmacistStats() {
  // Static stats for now; later will be fetched from API
  const stats = {
    totalDispensings: 120,
    uniqueMedications: 35,
    prescriptionsProcessed: 85,
  };

  return (
    <div className="p-4 bg-[#609bd8]/25 hover:bg-[#609bd8]/30 rounded-lg shadow-lg transition-all duration-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Key Statistics</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Total Dispensings</p>
          <span className="text-2xl font-bold text-gray-800">{stats.totalDispensings}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Unique Medications</p>
          <span className="text-2xl font-bold text-gray-800">{stats.uniqueMedications}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Prescriptions Processed</p>
          <span className="text-2xl font-bold text-gray-800">{stats.prescriptionsProcessed}</span>
        </div>
      </div>
    </div>
  );
}