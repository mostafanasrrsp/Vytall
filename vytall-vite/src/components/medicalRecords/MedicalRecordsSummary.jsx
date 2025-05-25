// src/components/ui/MedicalRecordsSummary.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../login/AuthContext';
import { fetchMedicalRecords } from '../../api/medicalRecords';

export default function MedicalRecordsSummary({ color = "#6bb7b7" }) {
  const { user } = useAuth();
  const isPatient = user?.role === 'Patient';
  const isFacility = user?.role === 'Facility';
  const [count, setCount] = useState(0);

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const data = await fetchMedicalRecords(); // fetch all
      let filtered = data;

      // If user is a patient, only count that patient's records
      if (isPatient) {
        filtered = data.filter((r) => r.patientId === Number(user.patientId));
      }
      // If user is a facility, only count records for patients at that facility
      else if (isFacility) {
        filtered = data.filter((r) => r.facilityId === Number(user.facilityId));
      }

      setCount(filtered.length);
    } catch (error) {
      console.error('Failed to fetch medical records for summary:', error);
    }
  }

  return (
    <Link to="/medicalrecords" className={`block p-6 bg-[${color}]/25 hover:bg-[${color}]/30 rounded-lg shadow-lg transition-all duration-200 hover:no-underline`}>
      <h2 className="text-xl font-bold mb-1 text-gray-800">Medical Records</h2>
      <p className="text-2xl font-bold text-black mb-4">{count}</p>
      <div className="flex justify-between items-center">
        <p className="text-gray-700 font-medium">View Details</p>
      </div>
    </Link>
  );
}