import React from 'react';
import MedicalRecordCard from './MedicalRecordCard';

export default function MedicalRecords() {
  const dummyRecords = [
    { id: 1, title: 'Annual Physical Exam', date: '2023-05-20' },
    { id: 2, title: 'Blood Test Results', date: '2023-08-15' },
  ];

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Medical Records</h1>
      {dummyRecords.map((record) => (
        <MedicalRecordCard key={record.id} record={record} />
      ))}
    </div>
  );
}