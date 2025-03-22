// src/components/ui/PhysicianStats.jsx
import React, { useEffect, useState } from 'react';
import { fetchAppointments } from '../../api/appointments';
import { useAuth } from '../../login/AuthContext';

export default function PhysicianStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    uniquePatients: 0,
    completedCount: 0,
    scheduledCount: 0
  });

  useEffect(() => {
    loadStats();
  }, [user]);

  async function loadStats() {
    try {
      const data = await fetchAppointments();
      // Filter by physician
      const physicianApps = data.filter(a => a.physicianId === Number(user.physicianId));

      // total appointments
      const totalAppointments = physicianApps.length;

      // unique patients
      const patientSet = new Set(physicianApps.map(a => a.patientId));
      const uniquePatients = patientSet.size;

      // completed vs. scheduled
      const completedCount = physicianApps.filter(a => a.status === "Completed").length;
      const scheduledCount = physicianApps.filter(a => a.status === "Scheduled").length;

      setStats({ totalAppointments, uniquePatients, completedCount, scheduledCount });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">Key Statistics</h2>
      <div className="flex flex-col space-y-2">
        <p>Total Appointments: <strong>{stats.totalAppointments}</strong></p>
        <p>Unique Patients: <strong>{stats.uniquePatients}</strong></p>
        <p>Completed: <strong>{stats.completedCount}</strong></p>
        <p>Scheduled: <strong>{stats.scheduledCount}</strong></p>
      </div>
    </div>
  );
}