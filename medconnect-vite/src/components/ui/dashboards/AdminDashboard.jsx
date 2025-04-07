import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUserMd, FaPrescription, FaHospital, FaCalendarAlt, 
  FaStethoscope, FaCapsules, FaClinicMedical, FaWallet,
  FaUserInjured, FaFileMedical, FaChartLine
} from 'react-icons/fa';

import { fetchPhysicians } from '../../../api/physicians';
import { fetchPharmacists } from '../../../api/pharmacists';
import { fetchPatients } from '../../../api/patients';
import { fetchDiagnoses } from '../../../api/diagnoses';
import { fetchAllPrescriptions } from '../../../api/prescriptions';
import { fetchDispensings } from '../../../api/dispensing';
import { fetchMedicalRecords } from '../../../api/medicalrecords';
import { fetchPharmacies } from '../../../api/pharmacies';
import { fetchAppointments } from '../../../api/appointments';
import { fetchMedicalFacilities } from '../../../api/medicalFacilities';
import PatientAnalytics from '../../Analytics/PatientAnalytics';
import AppointmentAnalytics from '../../Analytics/AppointmentAnalytics';
import MedicationAnalytics from '../../Analytics/MedicationAnalytics';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    appointments: 0,
    prescriptions: 0,
    medicalRecords: 0,
    walletBalance: 150,
    physicians: 0,
    pharmacists: 0,
    facilities: 0,
    diagnosis: 0,
    dispensing: 0,
    pharmacies: 0,
    patients: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          physicians,
          pharmacists,
          patients,
          diagnoses,
          prescriptions,
          dispensings,
          medicalRecords,
          pharmacies,
          appointments,
          facilities
        ] = await Promise.all([
          fetchPhysicians(),
          fetchPharmacists(),
          fetchPatients(),
          fetchDiagnoses(),
          fetchAllPrescriptions(),
          fetchDispensings(),
          fetchMedicalRecords(),
          fetchPharmacies(),
          fetchAppointments(),
          fetchMedicalFacilities()
        ]);

        setStats({
          physicians: physicians.length,
          pharmacists: pharmacists.length,
          patients: patients.length,
          diagnosis: diagnoses.length,
          prescriptions: prescriptions.length,
          dispensing: dispensings.length,
          medicalRecords: medicalRecords.length,
          pharmacies: pharmacies.length,
          appointments: appointments.length,
          facilities: facilities.length,
          walletBalance: 150
        });
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Welcome, Admin</h1>
        <p className="text-gray-600 mb-8">
          Manage users, facilities, appointments, diagnoses, and more.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          to="/manage-patients"
          label="Total Patients" 
          count={stats.patients}
          icon={<FaUserInjured className="w-6 h-6" />}
          color="bg-[#609bd8]/25 hover:bg-[#609bd8]/30"
        />
        <StatCard 
          to="/manage-physicians"
          label="Total Physicians" 
          count={stats.physicians}
          icon={<FaUserMd className="w-6 h-6" />}
          color="bg-[#6bb7b7]/25 hover:bg-[#6bb7b7]/30"
        />
        <StatCard 
          to="/manage-appointments"
          label="Total Appointments" 
          count={stats.appointments}
          icon={<FaCalendarAlt className="w-6 h-6" />}
          color="bg-[#7d9eeb]/25 hover:bg-[#7d9eeb]/30"
        />
        <StatCard 
          to="/manage-facilities"
          label="Total Facilities" 
          count={stats.facilities}
          icon={<FaHospital className="w-6 h-6" />}
          color="bg-[#8ab4d8]/25 hover:bg-[#8ab4d8]/30"
        />
      </div>

      {/* Analytics Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Analytics Overview</h2>
          <Link 
            to="/analytics" 
            className="flex items-center text-black hover:text-black"
          >
            <FaChartLine className="mr-2" />
            View Full Analytics
          </Link>
        </div>

        {/* First Row - Patient and Appointment Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Age and Gender Distribution */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Patient Demographics</h3>
            <div className="h-[200px]">
              <PatientAnalytics />
            </div>
          </div>

          {/* Appointment Status and Distribution */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Appointment Analytics</h3>
            <div className="h-[200px]">
              <AppointmentAnalytics />
            </div>
          </div>
        </div>

        {/* Second Row - Medication Stats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Medication Analytics</h3>
          <div className="h-[200px]">
            <MedicationAnalytics />
          </div>
        </div>
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          to="/manage-appointments" 
          label="Appointments" 
          count={stats.appointments}
          icon={<FaCalendarAlt className="w-6 h-6" />}
          color="bg-[#609bd8]/25 hover:bg-[#609bd8]/30"
        />
        <StatCard 
          to="/manage-diagnoses" 
          label="Diagnoses" 
          count={stats.diagnosis}
          icon={<FaStethoscope className="w-6 h-6" />}
          color="bg-[#6bb7b7]/25 hover:bg-[#6bb7b7]/30"
        />
        <StatCard 
          to="/manage-prescriptions" 
          label="Prescriptions" 
          count={stats.prescriptions}
          icon={<FaPrescription className="w-6 h-6" />}
          color="bg-[#7d9eeb]/25 hover:bg-[#7d9eeb]/30"
        />
        <StatCard 
          to="/manage-dispensing" 
          label="Dispensing" 
          count={stats.dispensing}
          icon={<FaCapsules className="w-6 h-6" />}
          color="bg-[#8ab4d8]/25 hover:bg-[#8ab4d8]/30"
        />
        <StatCard 
          to="/manage-pharmacies" 
          label="Pharmacies" 
          count={stats.pharmacies}
          icon={<FaClinicMedical className="w-6 h-6" />}
          color="bg-[#609bd8]/25 hover:bg-[#609bd8]/30"
        />
        <StatCard 
          to="/manage-medicalrecords" 
          label="Medical Records" 
          count={stats.medicalRecords}
          icon={<FaFileMedical className="w-6 h-6" />}
          color="bg-[#6bb7b7]/25 hover:bg-[#6bb7b7]/30"
        />
      </div>

      {/* Wallet Card */}
      <div className="grid grid-cols-1">
        <StatCard 
          to="/wallet" 
          label="System Wallet" 
          count={`$${stats.walletBalance}`}
          icon={<FaWallet className="w-6 h-6" />}
          color="bg-[#7d9eeb]/25 hover:bg-[#7d9eeb]/30"
        />
      </div>
    </div>
  );
}

function StatCard({ to, label, count, icon, color }) {
  const cardContent = (
    <div className={`p-6 rounded-lg shadow-sm transition-all duration-200 ${color}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-700">
          {icon}
        </div>
        <span className="text-3xl font-bold text-gray-800">{count}</span>
      </div>
      <h2 className="text-lg font-semibold text-gray-800">{label}</h2>
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