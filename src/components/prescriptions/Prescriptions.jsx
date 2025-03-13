import React from 'react';
import PrescriptionCard from './PrescriptionCard';

export default function Prescriptions() {
  const dummyPrescriptions = [
    { id: 1, medication: 'Amoxicillin', dosage: '500mg', frequency: 'Twice a day' },
    { id: 2, medication: 'Ibuprofen', dosage: '200mg', frequency: 'As needed for pain' },
  ];

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Prescriptions</h1>
      {dummyPrescriptions.map((prescription) => (
        <PrescriptionCard key={prescription.id} prescription={prescription} />
      ))}
    </div>
  );
}