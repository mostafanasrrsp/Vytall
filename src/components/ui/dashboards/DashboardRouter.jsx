// src/components/ui/DashboardRouter.jsx
import AdminDashboard from './AdminDashboard';
import PhysicianDashboard from './PhysicianDashboard';
import PharmacistDashboard from './PharmacistDashboard';
import PatientDashboard from './PatientDashboard';
import { useAuth } from '../../../login/AuthContext';

export default function DashboardRouter() {
  const { user } = useAuth();
  const role = user?.role;

  if (role === 'Admin') return <AdminDashboard />;
  if (role === 'Physician') return <PhysicianDashboard />;
  if (role === 'Pharmacist') return <PharmacistDashboard />;
  if (role === 'Patient') return <PatientDashboard />;

  return <p>Role not recognized</p>;
}