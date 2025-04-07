// src/components/Physicians/PhysicianPatientList.jsx
import React, { useEffect, useState } from 'react';
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
    <div className="p-4 bg-[#6bb7b7]/25 hover:bg-[#6bb7b7]/30 rounded-lg shadow-lg transition-all duration-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Your Patients</h2>
      {patients.length === 0 ? (
        <p className="text-gray-600">No patients found.</p>
      ) : (
        <div className="space-y-2">
          {patients.map(p => (
            <div key={p.patientId} className="flex justify-between items-center p-2 bg-white/50 rounded-md hover:bg-white/70 transition-all duration-200">
              <span className="text-gray-700 font-medium">{p.patientName}</span>
              <span className="text-gray-600 text-sm">ID: {p.patientId}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}