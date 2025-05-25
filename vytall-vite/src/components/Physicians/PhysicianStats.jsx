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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[#2c4c8c]">Key Statistics</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 bg-[#7d9eeb]/20 rounded-lg">
          <span className="text-[#2c4c8c]">Total Appointments</span>
          <span className="text-xl font-bold text-[#2c4c8c]">{stats.totalAppointments}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-[#7d9eeb]/20 rounded-lg">
          <span className="text-[#2c4c8c]">Unique Patients</span>
          <span className="text-xl font-bold text-[#2c4c8c]">{stats.uniquePatients}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-[#7d9eeb]/20 rounded-lg">
          <span className="text-[#2c4c8c]">Completed</span>
          <span className="text-xl font-bold text-[#2c4c8c]">{stats.completedCount}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-[#7d9eeb]/20 rounded-lg">
          <span className="text-[#2c4c8c]">Scheduled</span>
          <span className="text-xl font-bold text-[#2c4c8c]">{stats.scheduledCount}</span>
        </div>
      </div>
    </div>
  );
}