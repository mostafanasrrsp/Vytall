import React, { useEffect, useState } from 'react';
import { fetchAppointments, addAppointment, updateAppointment, deleteAppointment } from '../../api/appointments';
import { useAuth } from '../../login/AuthContext';
import Button from '../ui/Button';
import PatientSelect from '../ui/Forms/PatientSelect';
import PhysicianSelect from '../ui/Forms/PhysicianSelect';
import Select from 'react-select';
import { startAppointmentStatusMonitoring, APPOINTMENT_STATUS } from '../../services/appointmentStatusService';
import { startNotificationMonitoring, handleAppointmentStatusChange, requestNotificationPermission } from '../../services/notificationService';
import { fetchMedicalFacilities } from '../../api/medicalFacilities';

export default function AppointmentsManager({ patientId }) {
  const { user } = useAuth();
  const isPatient = user?.role === "Patient";
  const isPhysician = user?.role === "Physician";
  const isAdmin = user?.role === "Admin";
  const isFacility = user?.role === "Facility";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    patientId: patientId || (isPatient ? user.patientId : ''),
    physicianId: isPhysician ? user.physicianId : '',
    appointmentTime: '',
    status: APPOINTMENT_STATUS.SCHEDULED,
    reason: '',
    facilityId: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [facilitiesLoading, setFacilitiesLoading] = useState(false);
  const [facilitiesError, setFacilitiesError] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      setFacilitiesLoading(true);
      fetchMedicalFacilities()
        .then((data) => {
          setFacilities(data);
          setFacilitiesLoading(false);
        })
        .catch((err) => {
          setFacilitiesError('Failed to load facilities');
          setFacilitiesLoading(false);
        });
    }
  }, [isAdmin]);

  useEffect(() => {
    loadAppointments();
    requestNotificationPermission();
  }, [patientId]);

  useEffect(() => {
    if (appointments.length > 0) {
      // Start monitoring appointment statuses
      const statusCleanup = startAppointmentStatusMonitoring(appointments, (updatedAppointment) => {
        handleAppointmentStatusChange(updatedAppointment);
        setAppointments(prevAppointments =>
          prevAppointments.map(app =>
            app.appointmentId === updatedAppointment.appointmentId ? updatedAppointment : app
          )
        );
      });

      // Start monitoring for notifications
      const notificationCleanup = startNotificationMonitoring(appointments);

      return () => {
        statusCleanup();
        notificationCleanup();
      };
    }
  }, [appointments]);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      console.log('Loading appointments with context:', {
        patientId,
        isPatient,
        isPhysician,
        userId: user?.id,
        physicianId: user?.physicianId
      });

      // Always fetch all appointments first
      console.log('Fetching all appointments');
      data = await fetchAppointments();
      console.log('Received all appointments:', data);

      // If we're viewing a specific patient's profile or are a patient
      if (patientId || isPatient) {
        const targetPatientId = Number(patientId || user.patientId);
        console.log('Filtering for patient:', targetPatientId);
        data = data.filter(app => Number(app.patientId) === targetPatientId);
        console.log('Appointments after patient filtering:', data);
      }

      // If we're a physician (and not viewing a specific patient), filter for our appointments
      if (isPhysician && !patientId) {
        console.log('Filtering for physician:', user.physicianId);
        const physicianIdNum = Number(user.physicianId);
        data = data.filter((app) => Number(app.physicianId) === physicianIdNum);
        console.log('Appointments after physician filtering:', data);
      }

      console.log('Final appointments data:', data);
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      let errorMessage = "Failed to load appointments. ";
      if (error.message === "Network Error") {
        errorMessage += "Please check if the API server is running.";
      } else if (error.response) {
        errorMessage += error.response.data?.message || `Server returned ${error.response.status}`;
      } else {
        errorMessage += error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      appointmentId: editingId || 0,
      patientId: patientId || (isPatient ? user.patientId : Number(formData.patientId)),
      physicianId: isPhysician ? user.physicianId : Number(formData.physicianId),
      appointmentTime: formData.appointmentTime,
      status: formData.status,
      reason: formData.reason || null,
      facilityId: isAdmin ? Number(formData.facilityId) : (isFacility ? Number(user.facilityId) : null)
    };

    try {
      if (editingId) {
        await updateAppointment(editingId, dto);
      } else {
        await addAppointment(dto);
      }
      resetForm();
      loadAppointments();
    } catch (error) {
      console.error("Failed to save appointment:", error);
      setError("Failed to save appointment. Please try again.");
    }
  };

  const handleEdit = (appointment) => {
    setFormData({
      patientId: String(appointment.patientId),
      physicianId: String(appointment.physicianId),
      appointmentTime: appointment.appointmentTime.slice(0, 16),
      status: appointment.status,
      reason: appointment.reason || '',
      facilityId: appointment.facilityId ? String(appointment.facilityId) : '',
    });
    setEditingId(appointment.appointmentId);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAppointment(id);
      loadAppointments();
    } catch (error) {
      console.error("Failed to delete appointment:", error);
      setError("Failed to delete appointment. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: patientId || (isPatient ? user.patientId : ''),
      physicianId: isPhysician ? user.physicianId : '',
      appointmentTime: '',
      status: APPOINTMENT_STATUS.SCHEDULED,
      reason: '',
      facilityId: '',
    });
    setEditingId(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      [APPOINTMENT_STATUS.SCHEDULED]: 'bg-blue-100 text-blue-800',
      [APPOINTMENT_STATUS.IN_PROGRESS]: 'bg-green-100 text-green-800',
      [APPOINTMENT_STATUS.COMPLETED]: 'bg-gray-100 text-gray-800',
      [APPOINTMENT_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
      [APPOINTMENT_STATUS.MISSED]: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Appointment' : 'Add Appointment'}</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {loading ? (
          <div className="text-center py-4">Loading appointments...</div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              {!isPatient && !patientId && (
                <PatientSelect
                  value={formData.patientId}
                  onChange={(id) => setFormData({ ...formData, patientId: id })}
                />
              )}

              {(isPatient || isAdmin || isFacility) && (
                <PhysicianSelect
                  value={formData.physicianId}
                  onChange={(id) => setFormData({ ...formData, physicianId: id })}
                />
              )}

              <input
                type="datetime-local"
                value={formData.appointmentTime}
                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />

              <Select
                placeholder="Status"
                options={Object.values(APPOINTMENT_STATUS).map(status => ({
                  value: status,
                  label: status
                }))}
                value={{ value: formData.status, label: formData.status }}
                onChange={(selected) => setFormData({ ...formData, status: selected.value })}
                className="w-full"
              />

              <textarea
                placeholder="Reason (optional)"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full p-2 border rounded"
              />

              {/* Admin-only Facility Dropdown using react-select */}
              {isAdmin && (
                <Select
                  placeholder="Select Facility"
                  options={facilities.map(facility => ({
                    value: facility.facilityId,
                    label: facility.name || `Facility #${facility.facilityId}`
                  }))}
                  value={facilities.find(f => f.facilityId === Number(formData.facilityId)) ? {
                    value: Number(formData.facilityId),
                    label: facilities.find(f => f.facilityId === Number(formData.facilityId))?.name || `Facility #${formData.facilityId}`
                  } : null}
                  onChange={selected => setFormData({ ...formData, facilityId: selected ? selected.value : '' })}
                  isLoading={facilitiesLoading}
                  isClearable
                  required
                  className="w-full"
                />
              )}

              <Button type="submit" fullWidth>
                {editingId ? 'Update Appointment' : 'Add Appointment'}
              </Button>

              {editingId && (
                <Button onClick={resetForm} fullWidth variant="secondary">
                  Cancel Edit
                </Button>
              )}
            </form>

            <div className="space-y-4 w-full max-w-4xl">
              {appointments.length === 0 && !error && (
                <p className="text-gray-500 text-center">No appointments found.</p>
              )}

              {appointments.map((appointment) => (
                <div
                  key={appointment.appointmentId}
                  className="p-4 border rounded flex justify-between items-center bg-white shadow-md"
                >
                  <div>
                    <p><strong>Patient:</strong> {appointment.patientName || `ID: ${appointment.patientId}`}</p>
                    <p><strong>Physician:</strong> Dr. {appointment.physicianName || appointment.physicianId}</p>
                    <p><strong>Date:</strong> {new Date(appointment.appointmentTime).toLocaleString()}</p>
                    <p><strong>Status:</strong> <span className={`px-2 py-1 rounded ${getStatusColor(appointment.status)}`}>{appointment.status}</span></p>
                    {appointment.reason && <p><strong>Reason:</strong> {appointment.reason}</p>}
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={() => handleEdit(appointment)} variant="warning">Edit</Button>
                    <Button onClick={() => handleDelete(appointment.appointmentId)} variant="danger">Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}