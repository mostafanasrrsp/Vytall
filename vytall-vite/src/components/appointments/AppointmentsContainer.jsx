import React, { useEffect, useState } from 'react';
import AppointmentCard from '../appointments/AppointmentCard';
import { fetchAppointments, fetchAppointmentsForPatient } from '../../api/appointments';
import { useAuth } from '../../login/AuthContext';
import { Link } from 'react-router-dom';

export default function AppointmentsContainer() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function loadAppointments() {
      try {
        let data = [];

        if (user.role === "Patient") {
          data = await fetchAppointmentsForPatient(user.patientId);
        } else {
          data = await fetchAppointments();
        }

        const sorted = data.sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));
        setAppointments(sorted.slice(0, 3));
      } catch (error) {
        console.error("Failed to load appointments:", error);
      }
    }

    loadAppointments();
  }, [user]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#2c4c8c]">Upcoming Appointments</h2>
        <Link to="/manage-appointments" className="bg-[#609bd8] text-white hover:text-white px-3 py-1 rounded-full hover:bg-[#4a7daa] transition">
          +
        </Link>
      </div>
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments.</p>
        ) : (
          appointments.map(app => <AppointmentCard key={app.appointmentId} appointment={app} />)
        )}
      </div>
    </div>
  );
}