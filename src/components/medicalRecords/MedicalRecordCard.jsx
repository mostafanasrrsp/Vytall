import React from 'react';

export default function MedicalRecordCard({ record }) {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="font-semibold text-lg">{record.title}</h3>
      <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
    </div>
  );
}