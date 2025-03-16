// src/components/appointments/Appointments.jsx
import { useEffect, useState } from 'react';
import AppointmentCard from './AppointmentCard';
import { fetchAppointments } from '../../api/appointments';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments()
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