import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './login/AuthContext'; // ✅ Import both
import './App.css'; // Make sure this is your Tailwind file

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Login from './login/Login';
import Appointments from './components/appointments/Appointments';
import Prescriptions from './components/prescriptions/Prescriptions';
import MedicalRecords from './components/medicalRecords/MedicalRecords';
import Wallet from './components/wallet/Wallet';
import Physicians from './components/physicians/physicians';
import Pharmacists from './components/pharmacists/Pharmacists';
import Diagnosis from './components/diagnosis/Diagnosis';
import Dispensing from './components/Dispensing/Dispensing';

// Managers
import PharmacyManager from './components/Pharmacies/PharmacyManager';
import PhysiciansManager from './components/physicians/PhysiciansManager';
import PharmacistsManager from './components/Pharmacists/PharmacistsManager';
import FacilitiesManager from './components/MedicalFacilities/MedicalFacilitiesManager';
import AppointmentsManager from './components/appointments/AppointmentsManager';
import DiagnosesManager from './components/Diagnosis/DiagnosesManager';
import PrescriptionsManager from './components/Prescriptions/PrescriptionsManager';
import DispensingManager from './components/Dispensing/DispensingManager';
import PatientsManager from './components/Patients/PatientsManager';
import DashboardRouter from './components/ui/dashboards/DashboardRouter';
import MedicalRecordsManager from './components/MedicalRecords/MedicalRecordsManager';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';


export default function App() {
  return (
    <AuthProvider> {/* ✅ Wrap the whole app here */}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

// ✅ Separate Routes into another component to use `useAuth`
function AppRoutes() {
  const { user } = useAuth(); // ✅ Now this will work

  return (
    <Routes>
      {/* Login when not logged in */}
      {!user && <Route path="*" element={<Login />} />}

      {/* Protected routes when logged in */}
      {user && (
        <Route path="/" element={<MainLayout />}>
          {/* Dashboard */}
          <Route index element={<DashboardRouter />} />

          {/* Core Routes */}
          <Route path="appointments" element={<Appointments />} />
          <Route path="prescriptions" element={<Prescriptions />} />
          <Route path="medicalrecords" element={<MedicalRecords />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="physicians" element={<Physicians />} />
          <Route path="pharmacists" element={<Pharmacists />} />
          <Route path="diagnosis" element={<Diagnosis />} />
          <Route path="dispensing" element={<Dispensing />} />

          {/* Management Routes */}
          <Route path="manage-pharmacies" element={<PharmacyManager />} />
          <Route path="manage-physicians" element={<PhysiciansManager />} />
          <Route path="manage-pharmacists" element={<PharmacistsManager />} />
          <Route path="manage-facilities" element={<FacilitiesManager />} />
          <Route path="manage-appointments" element={<AppointmentsManager />} />
          <Route path="manage-diagnoses" element={<DiagnosesManager />} />
          <Route path="manage-prescriptions" element={<PrescriptionsManager />} />
          <Route path="manage-dispensing" element={<DispensingManager />} />
          <Route path="manage-patients" element={<PatientsManager />} />
          <Route path="manage-medicalrecords" element={<MedicalRecordsManager />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
        </Route>
      )}
    </Routes>
  );
}