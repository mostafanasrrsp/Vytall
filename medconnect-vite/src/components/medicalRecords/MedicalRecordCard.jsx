// src/components/medicalRecords/MedicalRecordCard.jsx
import React from 'react';

export default function MedicalRecordCard({ record }) {
  // Assume the backend returns `createdOn` in ISO format
  const dateStr = record.createdOn
    ? new Date(record.createdOn).toLocaleDateString()
    : 'Unknown Date';

  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition duration-200">
      <h3 className="text-lg font-semibold">{record.recordType}</h3>
      <p className="text-gray-600 mt-1">{record.details}</p>
      <p className="text-sm text-gray-500 mt-1">Date: {dateStr}</p>
      {record.imageUrl && (
        <img
          src={record.imageUrl}
          alt="Record Attachment"
          className="mt-2 w-32 h-32 object-cover rounded"
        />
      )}
    </div>
  );
}