import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './login/AuthContext';
import MainLayout from './components/layout/MainLayout';
import DashboardRouter from './components/ui/dashboards/DashboardRouter';
import PatientDashboard from './components/ui/dashboards/PatientDashboard';
import PhysicianDashboard from './components/ui/dashboards/PhysicianDashboard';
import PharmacistDashboard from './components/ui/dashboards/PharmacistDashboard';
import AdminDashboard from './components/ui/dashboards/AdminDashboard';
import FacilityDashboard from './components/ui/dashboards/FacilityDashboard';
import WarehouseDashboard from './components/ui/dashboards/WarehouseDashboard';
import PrescriptionsManager from './components/prescriptions/PrescriptionsManager';
import PhysiciansManager from './components/Physicians/PhysiciansManager';
import DispensingManager from './components/Dispensing/DispensingManager';
import Login from './login/Login';
import Appointments from './components/appointments/Appointments';
import AppointmentsManager from './components/appointments/AppointmentsManager';
import MedicalRecordsManager from './components/medicalRecords/MedicalRecordsManager';
import PatientsManager from './components/Patients/PatientsManager';
import PharmacyManager from './components/Pharmacies/PharmacyManager';
import DiagnosesManager from './components/Diagnosis/DiagnosesManager';
import MedicalFacilitiesManager from './components/MedicalFacilities/MedicalFacilitiesManager';
import TodaysAppointments from './components/ui/dashboards/TodaysAppointments';
import PendingDiagnoses from './components/ui/dashboards/PendingDiagnoses';
import ActivePrescriptions from './components/ui/dashboards/ActivePrescriptions';
import Wallet from './components/wallet/Wallet';
import ProviderDirectory from './components/Providers/ProviderDirectory';
import EmergencyContacts from './components/EmergencyServices/EmergencyContacts';
import ClinicalTrialMatching from './components/ClinicalTrials/ClinicalTrialMatching';
import MedicationAdherence from './components/Gamification/MedicationAdherence';
import { Report, Science, LocalPharmacy } from '@mui/icons-material';
import VideoConsultation from './components/telemedicine/VideoConsultation';
import SecureMessaging from './components/telemedicine/SecureMessaging';
import LowStockManager from './components/Warehouse/LowStockManager';
import ShipmentsManager from './components/Warehouse/ShipmentsManager';
import OrdersManager from './components/Warehouse/OrdersManager';
import InventoryManager from './components/Warehouse/InventoryManager';
import PharmacistManager from './components/Pharmacists/PharmacistsManager';
import Prescriptions from './components/prescriptions/Prescriptions';

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Placeholder component for unimplemented routes
const ComingSoon = ({ label }) => (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">{label}</h2>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">This feature will be available soon.</p>
    </div>
  </div>
);

const menuItems = [
  {
    title: 'Emergency Services',
    path: '/emergency',
    icon: <Report />,
    component: EmergencyContacts,
  },
  {
    title: 'Clinical Trials',
    path: '/clinical-trials',
    icon: <Science />,
    component: ClinicalTrialMatching,
  },
  {
    title: 'Medication Adherence',
    path: '/adherence',
    icon: <LocalPharmacy />,
    component: MedicationAdherence,
  },
];

// Add RoleBasedRedirect component
const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  switch (user.role) {
    case 'Admin':
      return <Navigate to="/admin-dashboard" />;
    case 'Physician':
      return <Navigate to="/physician-dashboard" />;
    case 'Pharmacist':
      return <Navigate to="/pharmacist-dashboard" />;
    case 'Patient':
      return <Navigate to="/patient-dashboard" />;
    case 'Facility':
      return <Navigate to="/facility-dashboard" />;
    case 'Warehouse':
      return <Navigate to="/warehouse-dashboard" />;
    default:
      return <Navigate to="/login" />;
  }
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Routes */}
          <Route index element={<RoleBasedRedirect />} />
          <Route path="patient-dashboard" element={<PatientDashboard />} />
          <Route path="physician-dashboard" element={<PhysicianDashboard />} />
          <Route path="pharmacist-dashboard" element={<PharmacistDashboard />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="facility-dashboard" element={<FacilityDashboard />} />
          <Route path="warehouse-dashboard" element={<WarehouseDashboard />} />
          
          {/* Dashboard Components */}
          <Route
            path="dashboard/todays-appointments"
            element={
              <ProtectedRoute allowedRoles={['Patient', 'Physician', 'Admin']}>
                <TodaysAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/pending-diagnoses"
            element={
              <ProtectedRoute allowedRoles={['Patient', 'Physician', 'Admin']}>
                <PendingDiagnoses />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/active-prescriptions"
            element={
              <ProtectedRoute allowedRoles={['Patient', 'Physician', 'Admin']}>
                <ActivePrescriptions />
              </ProtectedRoute>
            }
          />
          
          {/* Patient Routes */}
          <Route
            path="appointments"
            element={
              <ProtectedRoute allowedRoles={['Patient', 'Physician']}>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-prescriptions"
            element={
              <ProtectedRoute allowedRoles={['Patient']}>
                <Prescriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="prescriptions"
            element={
              <ProtectedRoute allowedRoles={['Physician']}>
                <PrescriptionsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="medical-records"
            element={
              <ProtectedRoute allowedRoles={['Patient', 'Physician']}>
                <MedicalRecordsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="wallet"
            element={
              <ProtectedRoute allowedRoles={['Patient', 'Admin']}>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="insurance"
            element={
              <ProtectedRoute allowedRoles={['Patient']}>
                <ComingSoon label="Insurance Information" />
              </ProtectedRoute>
            }
          />
          <Route
            path="emergencies"
            element={
              <ProtectedRoute allowedRoles={['Patient']}>
                <ComingSoon label="Emergency Contacts" />
              </ProtectedRoute>
            }
          />

          {/* Pharmacist Routes */}
          <Route
            path="dispensing"
            element={
              <ProtectedRoute allowedRoles={['Pharmacist', 'Admin']}>
                <DispensingManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="inventory"
            element={
              <ProtectedRoute allowedRoles={['Warehouse', 'Pharmacist', 'Admin']}>
                <InventoryManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute allowedRoles={['Warehouse', 'Pharmacist', 'Admin']}>
                <OrdersManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedRoute allowedRoles={['Pharmacist', 'Admin']}>
                <ComingSoon label="Analytics" />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="manage-patients"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Facility']}>
                <PatientsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="manage-physicians"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Facility']}>
                <PhysiciansManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="manage-pharmacists"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Facility']}>
                <PharmacistManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="manage-facilities"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <MedicalFacilitiesManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="manage-appointments"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Facility']}>
                <AppointmentsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="manage-diagnoses"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Facility']}>
                <DiagnosesManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="manage-prescriptions"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Facility']}>
                <PrescriptionsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="manage-dispensing"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <ComingSoon label="Manage Dispensing" />
              </ProtectedRoute>
            }
          />
          <Route
            path="manage-medical-records"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Facility']}>
                <MedicalRecordsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <ComingSoon label="Analytics" />
              </ProtectedRoute>
            }
          />

          {/* Provider Directory Route */}
          <Route
            path="providers"
            element={
              <ProtectedRoute allowedRoles={['Patient', 'Admin', 'Physician']}>
                <ProviderDirectory />
              </ProtectedRoute>
            }
          />

          {/* Add Telemedicine Routes */}
          <Route
            path="telemedicine/video"
            element={
              <ProtectedRoute allowedRoles={['Patient', 'Physician']}>
                <VideoConsultation />
              </ProtectedRoute>
            }
          />
          <Route
            path="telemedicine/messaging"
            element={
              <ProtectedRoute allowedRoles={['Patient', 'Physician']}>
                <SecureMessaging />
              </ProtectedRoute>
            }
          />

          {/* Warehouse Routes */}
          <Route
            path="low-stock"
            element={
              <ProtectedRoute allowedRoles={['Warehouse', 'Pharmacist', 'Admin']}>
                <LowStockManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="incoming-shipments"
            element={
              <ProtectedRoute allowedRoles={['Warehouse', 'Admin']}>
                <ShipmentsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute allowedRoles={['Warehouse', 'Pharmacist', 'Admin']}>
                <OrdersManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="inventory"
            element={
              <ProtectedRoute allowedRoles={['Warehouse', 'Pharmacist', 'Admin']}>
                <InventoryManager />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
} 