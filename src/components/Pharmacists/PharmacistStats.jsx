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
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">Key Statistics</h2>
      <p className="text-gray-700">Total Dispensings: <span className="font-semibold">{stats.totalDispensings}</span></p>
      <p className="text-gray-700">Unique Medications: <span className="font-semibold">{stats.uniqueMedications}</span></p>
      <p className="text-gray-700">Prescriptions Processed: <span className="font-semibold">{stats.prescriptionsProcessed}</span></p>
    </div>
  );
}