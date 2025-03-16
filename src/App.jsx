import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout
import MainLayout from './components/layout/MainLayout.jsx';

// UI Components
import Dashboard from './components/ui/dashboard.jsx';

// Core Components
import Appointments from './components/appointments/Appointments.jsx';
import Prescriptions from './components/prescriptions/Prescriptions.jsx';
import MedicalRecords from './components/medicalRecords/MedicalRecords.jsx';
import Billing from './components/billing/Billing.jsx';
import Physicians from './components/physicians/physicians.jsx';
import Pharmacists from './components/pharmacists/Pharmacists.jsx';
import Diagnosis from './components/diagnosis/Diagnosis.jsx';
import Dispensing from './components/Dispensing/Dispensing.jsx';
import PharmacyManager from './components/Pharmacies/PharmacyManager.jsx';
import PhysiciansManager from './components/physicians/PhysiciansManager.jsx';
import PharmacistsManager from './components/Pharmacists/PharmacistsManager.jsx';
import FacilitiesManager from './components/MedicalFacilities/MedicalFacilitiesManager.jsx';
import AppointmentsManager from './components/Appointments/AppointmentsManager.jsx';
import DiagnosesManager from './components/Diagnosis/DiagnosesManager.jsx';
import PrescriptionsManager from './components/Prescriptions/PrescriptionsManager.jsx';
import DispensingManager from './components/Dispensing/DispensingManager.jsx';
import PatientsManager from './components/Patients/PatientsManager.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Dashboard */}
        <Route
          path="/"
          element={
            <MainLayout title="Dashboard">
              <Dashboard />
            </MainLayout>
          }
        />

        {/* Existing Pages */}
        <Route
          path="/appointments"
          element={
            <MainLayout title="Appointments">
              <Appointments />
            </MainLayout>
          }
        />
        <Route
          path="/prescriptions"
          element={
            <MainLayout title="Prescriptions">
              <Prescriptions />
            </MainLayout>
          }
        />
        <Route
          path="/medicalrecords"
          element={
            <MainLayout title="Medical Records">
              <MedicalRecords />
            </MainLayout>
          }
        />
        <Route
          path="/billing"
          element={
            <MainLayout title="Billing">
              <Billing />
            </MainLayout>
          }
        />

        {/* New Pages */}
        <Route
          path="/physicians"
          element={
            <MainLayout title="Physicians">
              <Physicians />
            </MainLayout>
          }
        />
        <Route
          path="/pharmacists"
          element={
            <MainLayout title="Pharmacists">
              <Pharmacists />
            </MainLayout>
          }
        />
        <Route
          path="/diagnosis"
          element={
            <MainLayout title="Diagnosis">
              <Diagnosis />
            </MainLayout>
          }
        />
        <Route
          path="/dispensing"
          element={
            <MainLayout title="Dispensing">
              <Dispensing />
            </MainLayout>
          }
        />
        <Route
          path="/manage-pharmacies"
          element={
            <MainLayout title="Pharmacies">
              <PharmacyManager />
            </MainLayout>
          }
        />  
        <Route path="/manage-physicians" element={<MainLayout title="Physicians"><PhysiciansManager /></MainLayout>} />
<Route path="/manage-pharmacists" element={<MainLayout title="Pharmacists"><PharmacistsManager /></MainLayout>} />
<Route path="/manage-facilities" element={<MainLayout title="Facilities"><FacilitiesManager /></MainLayout>} />
<Route path="/manage-appointments" element={<MainLayout title="Appointments"><AppointmentsManager /></MainLayout>} />
<Route path="/manage-diagnoses" element={<MainLayout title="Diagnoses"><DiagnosesManager /></MainLayout>} />
<Route path="/manage-prescriptions" element={<MainLayout title="Prescriptions"><PrescriptionsManager /></MainLayout>} />
<Route path="/manage-dispensing" element={<MainLayout title="Dispensing"><DispensingManager /></MainLayout>} />
<Route path="/manage-patients" element={<MainLayout title="Patients"><PatientsManager /></MainLayout>} />

            </Routes>
    </Router>
  );
}

export default App;