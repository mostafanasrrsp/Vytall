// src/components/Physicians/PhysicianPatientList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAppointments } from '../../api/appointments';
import { useAuth } from '../../login/AuthContext';

export default function PhysicianPatientList() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    async function loadPatients() {
      const data = await fetchAppointments();
      // Filter appointments for the logged-in physician
      const physicianApps = data.filter(app => app.physicianId === Number(user.physicianId));
      // Group appointments by patientId
      const patientMap = new Map();
      physicianApps.forEach(app => {
        if (!patientMap.has(app.patientId)) {
          // You might have a patientName property; if not, fallback to "Patient {ID}"
          patientMap.set(app.patientId, { patientId: app.patientId, patientName: app.patientName || `Patient ${app.patientId}` });
        }
      });
      setPatients(Array.from(patientMap.values()));
    }
    loadPatients();
  }, [user.physicianId]);

  return (
    <div className="space-y-3">
      {patients.length === 0 ? (
        <p className="text-gray-600">No patients found.</p>
      ) : (
        <div className="space-y-3">
          {patients.map(p => (
            <div key={p.patientId} className="flex justify-between items-center p-3 bg-[#7d9eeb]/5 rounded-lg hover:bg-[#7d9eeb]/10 transition-all duration-200">
              <div className="flex flex-col">
                <span className="text-[#2c4c8c] font-medium">{p.patientName}</span>
                <span className="text-gray-500 text-sm">ID: {p.patientId}</span>
              </div>
              <Link
                to={`/patient-profile?id=${p.patientId}`}
                className="px-4 py-2 bg-[#7d9eeb] text-white rounded-full hover:bg-[#6b85c7] transition-all duration-200 text-sm font-medium"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}