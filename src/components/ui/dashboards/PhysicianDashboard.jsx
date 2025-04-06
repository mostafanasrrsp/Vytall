// src/components/ui/dashboards/PhysicianDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaUserInjured, 
  FaStethoscope, 
  FaPrescription,
  FaChartLine
} from 'react-icons/fa';
import { useAuth } from '../../../login/AuthContext';

import AppointmentsContainer from '../../Appointments/AppointmentsContainer';
import MedicalRecordsSummary from '../../medicalRecords/MedicalRecordsSummary';
import PhysicianPatientList from '../../Physicians/PhysicianPatientList';
import PhysicianStats from '../../Physicians/PhysicianStats';
import PatientAgeDistributionChart from '../../Analytics/PatientAgeDistributionChart';
import DiagnosisDistributionChart from '../../Analytics/DiagnosisDistributionChart';

export default function PhysicianDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingDiagnoses: 0,
    activePrescriptions: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const headers = {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        };

        setStats({
          totalPatients: 45,
          todayAppointments: 8,
          pendingDiagnoses: 3,
          activePrescriptions: 12
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    }

    fetchStats();
  }, [user]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome, Dr. Smith</h1>
        <p className="text-gray-600">
          Here's an overview of your patients and appointments for today.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Patients" 
          count={stats.totalPatients}
          icon={<FaUserInjured className="w-6 h-6" />}
          color="bg-[#609bd8]/25 hover:bg-[#609bd8]/30"
        />
        <StatCard 
          label="Today's Appointments" 
          count={stats.todayAppointments}
          icon={<FaCalendarAlt className="w-6 h-6" />}
          color="bg-[#6bb7b7]/25 hover:bg-[#6bb7b7]/30"
        />
        <StatCard 
          label="Pending Diagnoses" 
          count={stats.pendingDiagnoses}
          icon={<FaStethoscope className="w-6 h-6" />}
          color="bg-[#7d9eeb]/25 hover:bg-[#7d9eeb]/30"
        />
        <StatCard 
          label="Active Prescriptions" 
          count={stats.activePrescriptions}
          icon={<FaPrescription className="w-6 h-6" />}
          color="bg-[#8ab4d8]/25 hover:bg-[#8ab4d8]/30"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Appointments and Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointments Section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Today's Schedule</h2>
            </div>
            <div className="p-4">
              <AppointmentsContainer />
            </div>
          </div>

          {/* Analytics Overview */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Analytics</h2>
              <Link 
                to="/analytics" 
                className="flex items-center text-black hover:text-black"
              >
                <FaChartLine className="mr-2" />
                View Full Analytics
              </Link>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Age Distribution</h3>
                  <div className="aspect-square w-full max-w-[300px] mx-auto">
                    <PatientAgeDistributionChart />
                  </div>
                </div>
                <div className="w-full">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Diagnosis Types</h3>
                  <div className="aspect-square w-full max-w-[300px] mx-auto">
                    <DiagnosisDistributionChart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Performance Overview, Patient List and Medical Records */}
        <div className="space-y-6">
          {/* Performance Stats */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Performance Overview</h2>
            </div>
            <div className="p-4">
              <PhysicianStats />
            </div>
          </div>

          {/* Patient List Section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Your Patients</h2>
            </div>
            <div className="p-4">
              <PhysicianPatientList />
            </div>
          </div>

          {/* Medical Records Summary */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Records</h2>
            </div>
            <div className="p-4">
              <MedicalRecordsSummary color="#8ab4d8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, count, icon, color }) {
  return (
    <div className={`p-6 rounded-lg shadow-md ${color}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-700">
          {icon}
        </div>
        <span className="text-3xl font-bold text-gray-800">{count}</span>
      </div>
      <h2 className="text-lg font-semibold text-gray-800">{label}</h2>
    </div>
  );
}