import React from 'react';

export default function PrescriptionCard({ prescription }) {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="font-semibold text-lg">{prescription.medication}</h3>
      <p><strong>Dosage:</strong> {prescription.dosage}</p>
      <p><strong>Frequency:</strong> {prescription.frequency}</p>
    </div>
  );
}