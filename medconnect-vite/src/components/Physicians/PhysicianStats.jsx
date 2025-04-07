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
    <div className="p-4 bg-[#7d9eeb]/25 hover:bg-[#7d9eeb]/30 rounded-lg shadow-lg transition-all duration-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Key Statistics</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-2 bg-white/50 rounded-md">
          <span className="text-gray-700">Total Appointments</span>
          <span className="text-xl font-bold text-gray-800">{stats.totalAppointments}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white/50 rounded-md">
          <span className="text-gray-700">Unique Patients</span>
          <span className="text-xl font-bold text-gray-800">{stats.uniquePatients}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white/50 rounded-md">
          <span className="text-gray-700">Completed</span>
          <span className="text-xl font-bold text-gray-800">{stats.completedCount}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white/50 rounded-md">
          <span className="text-gray-700">Scheduled</span>
          <span className="text-xl font-bold text-gray-800">{stats.scheduledCount}</span>
        </div>
      </div>
    </div>
  );
}