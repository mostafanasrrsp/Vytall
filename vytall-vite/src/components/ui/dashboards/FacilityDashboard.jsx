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
  FaStethoscope,
  FaVideo,
  FaComments,
  FaHospital,
  FaFlask,
  FaPills,
  FaAmbulance,
  FaUserNurse,
  FaClipboardList
} from 'react-icons/fa';
import { fetchPhysicians } from '../../../api/physicians';
import { fetchPharmacists } from '../../../api/pharmacists';
import { fetchPatients } from '../../../api/patients';
import { fetchAppointments } from '../../../api/appointments';
import { fetchMedicalRecords } from '../../../api/medicalRecords';
import { fetchDiagnoses } from '../../../api/diagnoses';
import { fetchAllPrescriptions } from '../../../api/prescriptions';
import PatientAnalytics from '../../Analytics/PatientAnalytics';
import AppointmentAnalytics from '../../Analytics/AppointmentAnalytics';
import MedicationAnalytics from '../../Analytics/MedicationAnalytics';

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
      patientSatisfaction: 0,
      activeTelemedicine: 0,
      pendingDiagnoses: 0
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
            patientSatisfaction: 92,
            activeTelemedicine: appointments.filter(a => a.type === 'telemedicine' && a.status === 'Scheduled').length,
            pendingDiagnoses: diagnoses.filter(d => d.status === 'Pending').length
          }
        });
      } catch (error) {
        console.error("Failed to load facility stats:", error);
      }
    }

    loadStats();
  }, [user.facilityId]);

  return (
    <div className="p-6 space-y-8 mb-16">
      <div>
        <h1 className="text-3xl font-bold mb-2">Facility Dashboard</h1>
        <p className="text-gray-600">
          Comprehensive management of your healthcare facility's operations and services.
        </p>
      </div>
      
      {/* Core Facility Management */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Core Facility Management</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            to="/manage-physicians"
            label="Physicians"
            count={stats.physicians}
            icon={<FaUserMd className="w-6 h-6" />}
            color="bg-blue-50 hover:bg-blue-100"
            description="Manage medical staff"
          />

          <StatCard 
            to="/manage-pharmacists"
            label="Pharmacists"
            count={stats.pharmacists}
            icon={<FaCapsules className="w-6 h-6" />}
            color="bg-green-50 hover:bg-green-100"
            description="Manage pharmacy staff"
          />

          <StatCard 
            to="/manage-patients"
            label="Patients"
            count={stats.patients}
            icon={<FaUserInjured className="w-6 h-6" />}
            color="bg-purple-50 hover:bg-purple-100"
            description="Patient management"
          />

          <StatCard 
            to="/providers"
            label="Provider Directory"
            icon={<FaUserNurse className="w-6 h-6" />}
            color="bg-indigo-50 hover:bg-indigo-100"
            description="Healthcare provider network"
          />
        </div>
      </div>

      {/* Clinical Operations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Clinical Operations</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            to="/manage-appointments"
            label="Appointments"
            count={stats.appointments}
            icon={<FaCalendarAlt className="w-6 h-6" />}
            color="bg-yellow-50 hover:bg-yellow-100"
            description="Schedule management"
          />

          <StatCard 
            to="/manage-medical-records"
            label="Medical Records"
            count={stats.medicalRecords}
            icon={<FaFileMedical className="w-6 h-6" />}
            color="bg-red-50 hover:bg-red-100"
            description="Patient records"
          />

          <StatCard 
            to="/manage-diagnoses"
            label="Diagnoses"
            count={stats.diagnoses}
            icon={<FaStethoscope className="w-6 h-6" />}
            color="bg-pink-50 hover:bg-pink-100"
            description={`${stats.analytics.pendingDiagnoses} pending`}
          />

          <StatCard 
            to="/manage-prescriptions"
            label="Prescriptions"
            count={stats.prescriptions}
            icon={<FaPrescription className="w-6 h-6" />}
            color="bg-orange-50 hover:bg-orange-100"
            description="Medication management"
          />
        </div>
      </div>

      {/* Telemedicine & Special Services */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Telemedicine & Special Services</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            to="/telemedicine/video"
            label="Video Consultations"
            count={stats.analytics.activeTelemedicine}
            icon={<FaVideo className="w-6 h-6" />}
            color="bg-teal-50 hover:bg-teal-100"
            description="Virtual appointments"
          />

          <StatCard 
            to="/telemedicine/messaging"
            label="Secure Messaging"
            icon={<FaComments className="w-6 h-6" />}
            color="bg-cyan-50 hover:bg-cyan-100"
            description="Patient communication"
          />

          <StatCard 
            to="/emergency"
            label="Emergency Services"
            icon={<FaAmbulance className="w-6 h-6" />}
            color="bg-red-50 hover:bg-red-100"
            description="Emergency contacts"
          />

          <StatCard 
            to="/clinical-trials"
            label="Clinical Trials"
            icon={<FaFlask className="w-6 h-6" />}
            color="bg-violet-50 hover:bg-violet-100"
            description="Research opportunities"
          />
        </div>
      </div>

      {/* Analytics & Quality */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Analytics & Quality</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            to="/analytics"
            label="Facility Analytics"
            icon={<FaChartLine className="w-6 h-6" />}
            color="bg-blue-50 hover:bg-blue-100"
            description={`${stats.analytics.totalVisits} total visits`}
          />

          <StatCard 
            to="/adherence"
            label="Medication Adherence"
            icon={<FaPills className="w-6 h-6" />}
            color="bg-green-50 hover:bg-green-100"
            description="Patient compliance"
          />

          <StatCard 
            to="/quality-metrics"
            label="Quality Metrics"
            icon={<FaClipboardList className="w-6 h-6" />}
            color="bg-purple-50 hover:bg-purple-100"
            description={`${stats.analytics.patientSatisfaction}% satisfaction`}
          />
        </div>
      </div>

      {/* Analytics Section (moved to bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Patient Demographics</h2>
          </div>
          <div className="h-80">
            <PatientAnalytics />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Appointment Analytics</h2>
          </div>
          <div className="h-80">
            <AppointmentAnalytics />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Medication Analytics</h2>
        </div>
        <div className="h-80">
          <MedicationAnalytics />
        </div>
      </div>
    </div>
  );
}

function StatCard({ to, label, count, icon, color, description }) {
  const cardContent = (
    <div className={`p-6 rounded-lg shadow-lg transition-all duration-200 ${color}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
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