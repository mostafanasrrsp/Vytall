import React, { useEffect, useState } from 'react';
import { useAuth } from '../../login/AuthContext';
import { fetchPatientPrescriptions } from '../../api/prescriptions';
import { fetchAppointments } from '../../api/appointments';
import { fetchDiagnoses } from '../../api/diagnoses';
import { FaCalendarAlt, FaClipboardList, FaPills } from 'react-icons/fa';

export default function DashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayAppointments: [],
    pendingDiagnoses: [],
    activePrescriptions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardStats();
    // Set up polling for real-time updates
    const interval = setInterval(loadDashboardStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch appointments for today
      const appointments = await fetchAppointments();
      const todayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === today.getTime();
      });

      // Fetch pending diagnoses
      const diagnoses = await fetchDiagnoses();
      const pendingDiagnoses = diagnoses.filter(d => d.status === 'Pending');

      // Fetch active prescriptions
      let activePrescriptions = [];
      if (user?.role === 'Patient') {
        activePrescriptions = await fetchPatientPrescriptions(user.patientId);
      } else if (user?.role === 'Physician') {
        const allPrescriptions = await fetchPrescriptions(user.physicianId);
        activePrescriptions = allPrescriptions.filter(p => p.status === 'Active');
      }

      setStats({
        todayAppointments,
        pendingDiagnoses,
        activePrescriptions
      });
      setError(null);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats.todayAppointments.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-white rounded-lg shadow p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center mb-4">
          <FaCalendarAlt className="text-blue-500 text-xl mr-2" />
          <h3 className="text-lg font-semibold">Today's Appointments</h3>
        </div>
        {stats.todayAppointments.length === 0 ? (
          <p className="text-gray-500">No appointments scheduled for today</p>
        ) : (
          <div className="space-y-2">
            {stats.todayAppointments.map(apt => (
              <div key={apt.appointmentId} className="p-2 bg-blue-50 rounded">
                <p className="font-medium">{apt.patientName}</p>
                <p className="text-sm text-gray-600">
                  {new Date(apt.appointmentDate).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                {apt.notes && (
                  <p className="text-sm text-gray-500 mt-1">{apt.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Diagnoses */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center mb-4">
          <FaClipboardList className="text-orange-500 text-xl mr-2" />
          <h3 className="text-lg font-semibold">Pending Diagnoses</h3>
        </div>
        {stats.pendingDiagnoses.length === 0 ? (
          <p className="text-gray-500">No pending diagnoses</p>
        ) : (
          <div className="space-y-2">
            {stats.pendingDiagnoses.map(diagnosis => (
              <div key={diagnosis.diagnosisId} className="p-2 bg-orange-50 rounded">
                <p className="font-medium">{diagnosis.patientName}</p>
                <p className="text-sm text-gray-600">{diagnosis.symptoms}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(diagnosis.createdDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Prescriptions */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center mb-4">
          <FaPills className="text-green-500 text-xl mr-2" />
          <h3 className="text-lg font-semibold">Active Prescriptions</h3>
        </div>
        {stats.activePrescriptions.length === 0 ? (
          <p className="text-gray-500">No active prescriptions</p>
        ) : (
          <div className="space-y-2">
            {stats.activePrescriptions.map(prescription => (
              <div key={prescription.prescriptionId} className="p-2 bg-green-50 rounded">
                <p className="font-medium">
                  {user?.role === 'Patient' 
                    ? prescription.physicianName 
                    : prescription.patientName}
                </p>
                <div className="text-sm text-gray-600">
                  {prescription.medications.map((med, index) => (
                    <p key={index}>
                      • {med.medicationDetails} ({med.dosage})
                    </p>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Expires: {new Date(prescription.expirationDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 