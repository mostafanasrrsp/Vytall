// src/components/medicalRecords/MedicalRecords.jsx
import React, { useEffect, useState } from 'react';
import MedicalRecordCard from './MedicalRecordCard';
import { fetchMedicalRecords } from '../../api/medicalRecords';
import { useAuth } from '../../login/AuthContext';

export default function MedicalRecords() {
  const { user } = useAuth();
  const isPatient = user?.role === 'Patient';
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const data = await fetchMedicalRecords();
      let filtered = data;
      if (isPatient) {
        filtered = data.filter((r) => r.patientId === Number(user.patientId));
      }
      setRecords(filtered);
    } catch (error) {
      console.error('Failed to fetch medical records:', error);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Medical Records</h1>
      {records.length === 0 ? (
        <p className="text-gray-500">No medical records found.</p>
      ) : (
        records.map((record) => <MedicalRecordCard key={record.medicalRecordId} record={record} />)
      )}
    </div>
  );
}