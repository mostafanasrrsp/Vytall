// AppointmentCard.jsx
import { useAuth } from '../../login/AuthContext';

export default function AppointmentCard({ appointment }) {
    const { user } = useAuth();
    const { appointmentTime, physicianName, patientName, reason, status } = appointment;

    // Determine label based on role
    const displayName =
      user?.role === "Physician"
        ? `Patient: ${patientName}`
        : `Dr. ${physicianName}`;

    return (
      <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition duration-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{new Date(appointmentTime).toLocaleString()}</h3>
          {status && (
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                status === 'Scheduled'
                  ? 'bg-blue-100 text-blue-800'
                  : status === 'Completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {status}
            </span>
          )}
        </div>
        <p className="text-gray-700 font-medium">{displayName}</p>
        <p className="text-gray-600">{reason}</p>
      </div>
    );
}