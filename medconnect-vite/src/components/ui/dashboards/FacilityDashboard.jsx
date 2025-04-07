import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../login/AuthContext';
import { 
  FaUserMd, 
  FaPrescription, 
  FaUserInjured, 
  FaCalendarAlt,
  FaFileMedical,
  FaChartLine,
  FaCapsules,
  FaStethoscope
} from 'react-icons/fa';
import { fetchPhysicians } from '../../../api/physicians';
import { fetchPharmacists } from '../../../api/pharmacists';
import { fetchPatients } from '../../../api/patients';
import { fetchAppointments } from '../../../api/appointments';
import { fetchMedicalRecords } from '../../../api/medicalrecords';
import { fetchDiagnoses } from '../../../api/diagnoses';
import { fetchAllPrescriptions } from '../../../api/prescriptions';

export default function FacilityDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    physicians: 0,
    pharmacists: 0,
    patients: 0,
    appointments: 0,
    medicalRecords: 0,
    diagnoses: 0,
    prescriptions: 0,
    analytics: {
      totalVisits: 0,
      avgVisitDuration: 0,
      patientSatisfaction: 0
    }
  });

  const calculateAverageVisitDuration = (appointments) => {
    const completedAppointments = appointments.filter(a => a.status === 'Completed');
    if (completedAppointments.length === 0) return 0;
    
    const totalDuration = completedAppointments.reduce((acc, curr) => acc + (curr.duration || 30), 0);
    return Math.round(totalDuration / completedAppointments.length);
  };

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          physicians,
          pharmacists,
          patients,
          appointments,
          medicalRecords,
          diagnoses,
          prescriptions
        ] = await Promise.all([
          fetchPhysicians(),
          fetchPharmacists(),
          fetchPatients(),
          fetchAppointments(),
          fetchMedicalRecords(),
          fetchDiagnoses(),
          fetchAllPrescriptions()
        ]);

        // Debug logging
        console.log('Facility ID:', user.facilityId);
        console.log('Data from API:', {
          physicians,
          pharmacists,
          patients,
          appointments,
          medicalRecords,
          diagnoses,
          prescriptions
        });

        setStats({
          physicians: physicians.length,
          pharmacists: pharmacists.length,
          patients: patients.length,
          appointments: appointments.length,
          medicalRecords: medicalRecords.length,
          diagnoses: diagnoses.length,
          prescriptions: prescriptions.length,
          analytics: {
            totalVisits: appointments.filter(a => a.status === 'Completed').length,
            avgVisitDuration: calculateAverageVisitDuration(appointments),
            patientSatisfaction: 92 // This would come from a real satisfaction survey API
          }
        });
      } catch (error) {
        console.error("Failed to load facility stats:", error);
      }
    }

    loadStats();
  }, [user.facilityId]);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Facility Dashboard</h1>
        <p className="text-gray-600">
          Manage your facility's staff, patients, and services.
        </p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          to="/manage-physicians"
          label="Physicians"
          count={stats.physicians}
          icon={<FaUserMd className="w-6 h-6" />}
          color="bg-[#609bd8]/25 hover:bg-[#609bd8]/30"
          description="Add and manage physicians"
        />

        <StatCard 
          to="/manage-pharmacists"
          label="Pharmacists"
          count={stats.pharmacists}
          icon={<FaCapsules className="w-6 h-6" />}
          color="bg-[#6bb7b7]/25 hover:bg-[#6bb7b7]/30"
          description="Add and manage pharmacists"
        />

        <StatCard 
          to="/manage-patients"
          label="Patients"
          count={stats.patients}
          icon={<FaUserInjured className="w-6 h-6" />}
          color="bg-[#7d9eeb]/25 hover:bg-[#7d9eeb]/30"
          description="View and manage patients"
        />

        <StatCard 
          to="/manage-appointments"
          label="Appointments"
          count={stats.appointments}
          icon={<FaCalendarAlt className="w-6 h-6" />}
          color="bg-[#8ab4d8]/25 hover:bg-[#8ab4d8]/30"
          description="Schedule and manage appointments"
        />

        <StatCard 
          to="/manage-medicalrecords"
          label="Medical Records"
          count={stats.medicalRecords}
          icon={<FaFileMedical className="w-6 h-6" />}
          color="bg-[#609bd8]/25 hover:bg-[#609bd8]/30"
          description="Access patient records"
        />

        <StatCard 
          to="/analytics"
          label="Analytics"
          count={`${stats.analytics.patientSatisfaction}%`}
          icon={<FaChartLine className="w-6 h-6" />}
          color="bg-[#6bb7b7]/25 hover:bg-[#6bb7b7]/30"
          description={`${stats.analytics.totalVisits} total visits`}
        />
      </div>
    </div>
  );
}

function StatCard({ to, label, count, icon, color, description }) {
  const cardContent = (
    <div className={`p-6 rounded-lg shadow-lg transition-all duration-200 ${color}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-700">
          {icon}
        </div>
        {count !== undefined && (
          <span className="text-3xl font-bold text-gray-800">{count}</span>
        )}
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">{label}</h2>
      <p className="text-gray-700 font-medium">{description}</p>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block hover:scale-[1.02] transition-transform duration-200">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
} 