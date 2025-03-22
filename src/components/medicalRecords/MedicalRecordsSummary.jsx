// src/components/ui/MedicalRecordsSummary.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../login/AuthContext';
import { fetchMedicalRecords } from '../../api/medicalrecords';

export default function MedicalRecordsSummary() {
  const { user } = useAuth();
  const isPatient = user?.role === 'Patient';
  const [count, setCount] = useState(0);

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const data = await fetchMedicalRecords(); // fetch all
      let filtered = data;

      // If user is a patient, only count that patient’s records
      if (isPatient) {
        filtered = data.filter((r) => r.patientId === Number(user.patientId));
      }

      setCount(filtered.length);
    } catch (error) {
      console.error('Failed to fetch medical records for summary:', error);
    }
  }

  return (
    <Link to="/medicalrecords" className="block p-4 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition">
      <h2 className="text-black text-xl font-bold">Medical Records</h2>
      <p className="text-black text-3xl font-bold">{count}</p>
      <p className="text-black mt-2">View Details</p>
    </Link>
  );
}