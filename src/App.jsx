import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainLayout from './components/layout/MainLayout.jsx';
import Appointments from './components/appointments/Appointments.jsx';
import Prescriptions from './components/prescriptions/Prescriptions.jsx';
import MedicalRecords from './components/medicalrecords/MedicalRecords.jsx';
import Billing from './components/billing/Billing.jsx';
import Dashboard from './components/ui/Dashboard.jsx'; // Just in case not imported

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<MainLayout title="Dashboard"><Dashboard /></MainLayout>} />
      <Route path="/appointments" element={<MainLayout title="Appointments"><Appointments /></MainLayout>} />
      <Route path="/prescriptions" element={<MainLayout title="Prescriptions"><Prescriptions /></MainLayout>} />
      <Route path="/medicalRecords" element={<MainLayout title="Medical Records"><MedicalRecords /></MainLayout>} />
      <Route path="/billing" element={<MainLayout title="Billing"><Billing /></MainLayout>} />
    </Routes>
  </Router>
  );
}

export default App;