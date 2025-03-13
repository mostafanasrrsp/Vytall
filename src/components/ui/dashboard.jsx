import { Link } from 'react-router-dom';

export default function Dashboard() {
  // Temporary summary stats (these can later be fetched from backend or passed as props)
  const stats = {
    appointments: 5, // You can later replace this with actual count fetched from API
    prescriptions: 3,
    medicalRecords: 12,
    billingDue: '$150',
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to MedConnect</h1>
      <p className="text-gray-600 mb-8">
        Manage appointments, prescriptions, medical records, and billing.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Appointments */}
        <Link
          to="/appointments"
          className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block"
        >
          <h2 className="text-lg font-semibold mb-2">Appointments</h2>
          <p className="text-3xl font-bold">{stats.appointments}</p>
          <p className="text-sm text-gray-500 mt-1">Upcoming</p>
        </Link>

        {/* Prescriptions */}
        <Link
          to="/prescriptions"
          className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block"
        >
          <h2 className="text-lg font-semibold mb-2">Prescriptions</h2>
          <p className="text-3xl font-bold">{stats.prescriptions}</p>
          <p className="text-sm text-gray-500 mt-1">Active</p>
        </Link>

        {/* Medical Records */}
        <Link
          to="/medicalrecords"
          className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block"
        >
          <h2 className="text-lg font-semibold mb-2">Medical Records</h2>
          <p className="text-3xl font-bold">{stats.medicalRecords}</p>
          <p className="text-sm text-gray-500 mt-1">Available</p>
        </Link>

        {/* Billing */}
        <Link
          to="/billing"
          className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block"
        >
          <h2 className="text-lg font-semibold mb-2">Billing</h2>
          <p className="text-3xl font-bold">{stats.billingDue}</p>
          <p className="text-sm text-gray-500 mt-1">Due</p>
        </Link>
      </div>
    </div>
  );
}