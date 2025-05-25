import React, { useEffect, useState } from 'react';
import { fetchAppointments } from '../../../api/appointments';
import { useAuth } from '../../../login/AuthContext';
import Button from '../../ui/Button';

export default function TodaysAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTodaysAppointments();
  }, []);

  const loadTodaysAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAppointments();
      
      // Filter for today's appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todaysAppointments = data.filter(app => {
        const appDate = new Date(app.appointmentTime);
        return appDate >= today && appDate < tomorrow;
      });

      // Sort by appointment time
      todaysAppointments.sort((a, b) => 
        new Date(a.appointmentTime) - new Date(b.appointmentTime)
      );

      // If physician, filter for their appointments
      const filteredAppointments = user?.role === "Physician" 
        ? todaysAppointments.filter(app => Number(app.physicianId) === Number(user.physicianId))
        : todaysAppointments;

      setAppointments(filteredAppointments);
    } catch (error) {
      console.error("Error fetching today's appointments:", error);
      setError("Failed to load today's appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentStatus = (appointmentTime) => {
    const now = new Date();
    const appTime = new Date(appointmentTime);
    const timeDiff = appTime - now;
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (minutesDiff < -30) return "Completed";
    if (minutesDiff < 0) return "In Progress";
    if (minutesDiff < 30) return "Upcoming";
    return "Scheduled";
  };

  if (loading) return <div className="text-center py-4">Loading appointments...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Today's Appointments</h2>
        <Button onClick={loadTodaysAppointments}>Refresh</Button>
      </div>

      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center">No appointments scheduled for today.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => {
            const status = getAppointmentStatus(appointment.appointmentTime);
            const statusColors = {
              "Completed": "bg-gray-100",
              "In Progress": "bg-green-100",
              "Upcoming": "bg-yellow-100",
              "Scheduled": "bg-blue-100"
            };

            return (
              <div
                key={appointment.appointmentId}
                className={`p-4 rounded-lg shadow ${statusColors[status]} transition-colors duration-200`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{new Date(appointment.appointmentTime).toLocaleTimeString()}</p>
                    <p><strong>Patient:</strong> {appointment.patientName}</p>
                    <p><strong>Physician:</strong> Dr. {appointment.physicianName}</p>
                    {appointment.reason && <p><strong>Reason:</strong> {appointment.reason}</p>}
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium`}>
                      {status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 