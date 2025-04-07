// src/components/appointments/Appointments.jsx
import { useEffect, useState } from 'react';
import AppointmentCard from './AppointmentCard';
import { fetchAppointmentsForPatient } from '../../api/appointments';
import { useAuth } from '../../login/AuthContext';

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointmentsForPatient(user.patientId)
      .then(data => setAppointments(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4 p-4">
      {appointments.length === 0 ? (
        <p className="text-gray-500">No upcoming appointments.</p>
      ) : (
        appointments.map((app) => (
          <AppointmentCard key={app.id} appointment={app} />
        ))
      )}
    </div>
  );
}