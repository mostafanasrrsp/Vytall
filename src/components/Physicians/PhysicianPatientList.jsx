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
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Patients</h2>
      {patients.length === 0 ? (
        <p className="text-gray-500">No patients found.</p>
      ) : (
        <ul className="space-y-2">
          {patients.map(p => (
            <li key={p.patientId} className="p-2 border rounded hover:bg-gray-100 transition">
              <span className="font-semibold">{p.patientName}</span> (ID: {p.patientId})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}