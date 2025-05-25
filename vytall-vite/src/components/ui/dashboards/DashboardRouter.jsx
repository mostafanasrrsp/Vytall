// src/components/ui/DashboardRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../../login/AuthContext';
import AdminDashboard from './AdminDashboard';
import PhysicianDashboard from './PhysicianDashboard';
import PharmacistDashboard from './PharmacistDashboard';
import PatientDashboard from './PatientDashboard';
import FacilityDashboard from './FacilityDashboard';
import WarehouseDashboard from './WarehouseDashboard';

// Import additional components for nested routes
import TodaysAppointments from './TodaysAppointments';
import PendingDiagnoses from './PendingDiagnoses';
import ActivePrescriptions from './ActivePrescriptions';

export default function DashboardRouter() {
  const { user } = useAuth();
  const role = user?.role;

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  switch (role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Physician':
      return <PhysicianDashboard />;
    case 'Pharmacist':
      return <PharmacistDashboard />;
    case 'Patient':
      return <PatientDashboard />;
    case 'Facility':
      return <FacilityDashboard />;
    case 'Warehouse':
      return <WarehouseDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
}