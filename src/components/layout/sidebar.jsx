// src/components/layout/Sidebar.jsx
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-indigo-600/60 text-white p-6 space-y-4">
      <h2 className="text-lg font-bold">Vytall Portal</h2>
      <nav className="flex flex-col space-y-2">
        <Link to="/" className="hover:bg-white hover:bg-opacity-20 p-2 rounded">Dashboard</Link>
        <Link to="/appointments" className="hover:bg-white hover:bg-opacity-20 p-2 rounded">Appointments</Link>
        <Link to="/billing" className="hover:bg-white hover:bg-opacity-20 p-2 rounded">Billing</Link>
        <Link to="/prescriptions" className="hover:bg-white hover:bg-opacity-20 p-2 rounded">Prescriptions</Link>
        <Link to="/medicalrecords" className="hover:bg-white hover:bg-opacity-20 p-2 rounded">Medical Records</Link>
      </nav>
    </aside>
  );
}