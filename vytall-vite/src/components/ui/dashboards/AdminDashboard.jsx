import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUserMd, FaPrescription, FaHospital, FaCalendarAlt, 
  FaStethoscope, FaCapsules, FaClinicMedical, FaWallet,
  FaUserInjured, FaFileMedical, FaChartLine, FaClock,
  FaClipboardList, FaTablets, FaArrowUp, FaArrowDown,
  FaExclamationTriangle
} from 'react-icons/fa';

import { fetchPhysicians } from '../../../api/physicians';
import { fetchPharmacists } from '../../../api/pharmacists';
import { fetchPatients } from '../../../api/patients';
import { fetchDiagnoses } from '../../../api/diagnoses';
import { fetchAllPrescriptions } from '../../../api/prescriptions';
import { fetchDispensings } from '../../../api/dispensing';
import { fetchMedicalRecords } from '../../../api/medicalRecords';
import { fetchPharmacies } from '../../../api/pharmacies';
import { fetchAppointments } from '../../../api/appointments';
import { fetchMedicalFacilities } from '../../../api/medicalFacilities';
import PatientAnalytics from '../../Analytics/PatientAnalytics';
import AppointmentAnalytics from '../../Analytics/AppointmentAnalytics';
import MedicationAnalytics from '../../Analytics/MedicationAnalytics';

// Stat Card Component
function StatCard({ title, value, icon, trend, trendValue, color, link }) {
  const CardContent = (
    <div className={`p-6 rounded-lg shadow-sm ${color} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex flex-col items-start min-h-[3.5rem] justify-center">
            <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
            {trend ? (
              <div className="flex items-center text-sm mt-1">
                {trend === 'up' ? (
                  <FaArrowUp className="text-green-500 mr-1" />
                ) : (
                  <FaArrowDown className="text-red-500 mr-1" />
                )}
                <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {trendValue}% from last month
                </span>
              </div>
            ) : (
              <div className="opacity-0 mt-1 text-sm">placeholder</div>
            )}
          </div>
        </div>
        <div className="p-3 rounded-full bg-white/50">
          {icon}
        </div>
      </div>
    </div>
  );

  return link ? (
    <Link to={link} className="block">
      {CardContent}
    </Link>
  ) : CardContent;
}

// Alert Card Component
function AlertCard({ title, message, type, icon }) {
  const bgColor = type === 'warning' ? 'bg-yellow-50' : 'bg-red-50';
  const textColor = type === 'warning' ? 'text-yellow-800' : 'text-red-800';
  const borderColor = type === 'warning' ? 'border-yellow-200' : 'border-red-200';

  return (
    <div className={`p-4 rounded-lg border ${bgColor} ${borderColor} ${textColor}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="mt-1 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    appointments: 0,
    todayAppointments: 0,
    prescriptions: 0,
    activePrescriptions: 0,
    medicalRecords: 0,
    walletBalance: 150,
    physicians: 0,
    pharmacists: 0,
    facilities: 0,
    diagnosis: 0,
    pendingDiagnoses: 0,
    dispensing: 0,
    pharmacies: 0,
    patients: 0,
  });

  const [alerts, setAlerts] = useState([
    {
      title: 'High Patient Volume',
      message: 'Patient appointments have increased by 25% this week',
      type: 'warning',
      icon: <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />,
    },
    {
      title: 'Prescription Alert',
      message: '5 prescriptions are pending approval',
      type: 'warning',
      icon: <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />,
    },
  ]);

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

        // Calculate today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayAppointments = appointments.filter(app => {
          const appDate = new Date(app.appointmentTime);
          return appDate >= today && appDate < tomorrow;
        });

        // Calculate active prescriptions
        const activePrescriptions = prescriptions.filter(prescription => {
          const endDate = new Date(prescription.endDate);
          const today = new Date();
          return endDate >= today && prescription.status === "Active";
        });

        // Calculate pending diagnoses
        const pendingDiagnoses = diagnoses.filter(diagnosis => 
          diagnosis.status === "Pending" || diagnosis.status === "In Review"
        );

        setStats({
          physicians: physicians.length,
          pharmacists: pharmacists.length,
          patients: patients.length,
          diagnosis: diagnoses.length,
          pendingDiagnoses: pendingDiagnoses.length,
          prescriptions: prescriptions.length,
          activePrescriptions: activePrescriptions.length,
          dispensing: dispensings.length,
          medicalRecords: medicalRecords.length,
          pharmacies: pharmacies.length,
          appointments: appointments.length,
          todayAppointments: todayAppointments.length,
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
    <div className="space-y-6 mb-16">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Admin</h1>
        <p className="mt-1 text-gray-600">Here's what's happening in your medical system today.</p>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <AlertCard key={index} {...alert} />
          ))}
        </div>
      )}

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.patients}
          icon={<FaUserInjured className="w-6 h-6 text-blue-600" />}
          trend="up"
          trendValue="12"
          color="bg-blue-50"
          link="/manage-patients"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={<FaCalendarAlt className="w-6 h-6 text-green-600" />}
          color="bg-green-50"
          link="/dashboard/todays-appointments"
        />
        <StatCard
          title="Active Prescriptions"
          value={stats.activePrescriptions}
          icon={<FaPrescription className="w-6 h-6 text-purple-600" />}
          trend="up"
          trendValue="8"
          color="bg-purple-50"
          link="/dashboard/active-prescriptions"
        />
        <StatCard
          title="Pending Diagnoses"
          value={stats.pendingDiagnoses}
          icon={<FaStethoscope className="w-6 h-6 text-yellow-600" />}
          color="bg-yellow-50"
          link="/dashboard/pending-diagnoses"
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Patient Demographics</h2>
            <Link to="/analytics" className="text-sm text-blue-600 hover:text-blue-800">
              View Details
            </Link>
          </div>
          <div className="h-80">
            <PatientAnalytics />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Appointment Analytics</h2>
            <Link to="/analytics" className="text-sm text-blue-600 hover:text-blue-800">
              View Details
            </Link>
          </div>
          <div className="h-80">
            <AppointmentAnalytics />
          </div>
        </div>
      </div>

      {/* Additional Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Physicians"
          value={stats.physicians}
          icon={<FaUserMd className="w-6 h-6 text-indigo-600" />}
          color="bg-indigo-50"
          link="/manage-physicians"
        />
        <StatCard
          title="Total Pharmacists"
          value={stats.pharmacists}
          icon={<FaCapsules className="w-6 h-6 text-pink-600" />}
          color="bg-pink-50"
          link="/manage-pharmacists"
        />
        <StatCard
          title="Total Facilities"
          value={stats.facilities}
          icon={<FaHospital className="w-6 h-6 text-teal-600" />}
          color="bg-teal-50"
          link="/manage-facilities"
        />
      </div>

      {/* Medication Analytics Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Medication Analytics</h2>
          <Link to="/analytics" className="text-sm text-blue-600 hover:text-blue-800">
            View Details
          </Link>
        </div>
        <div className="h-80">
          <MedicationAnalytics />
        </div>
      </div>
    </div>
  );
}