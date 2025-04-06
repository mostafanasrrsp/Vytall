import React, { useEffect, useState } from 'react';
import { fetchAppointments, fetchAppointmentsForPatient, addAppointment, updateAppointment, deleteAppointment } from '../../api/appointments';
import { useAuth } from '../../login/AuthContext';
import Button from '../ui/Button';
import PatientSelect from '../ui/Forms/PatientSelect';
import PhysicianSelect from '../ui/Forms/PhysicianSelect';
import Select from 'react-select';


export default function AppointmentsManager() {
  const { user } = useAuth();
  const isPatient = user?.role === "Patient";
  const isPhysician = user?.role === "Physician";
  const isAdmin = user?.role === "Admin";
  const isFacility = user?.role === "Facility";

  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    patientId: isPatient ? user.patientId : '', // Auto-fill for patient role
    physicianId: isPhysician ? user.physicianId : '', // Auto-assign for physicians
    appointmentTime: '',
    status: '',
    reason: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      let data = [];

      if (isPatient) {
        data = await fetchAppointmentsForPatient(user.patientId);
      } else {
        data = await fetchAppointments();
        if (isPhysician) {
          data = data.filter((app) => app.physicianId === user.physicianId);
        }
      }

      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      appointmentId: editingId || 0,
      patientId: isPatient ? user.patientId : Number(formData.patientId),
      physicianId: isPhysician ? user.physicianId : Number(formData.physicianId),
      appointmentTime: formData.appointmentTime,
      status: formData.status,
      reason: formData.reason || null,
      facilityId: isFacility ? Number(user.facilityId) : null
    };

    console.log("Submitting appointment with data:", dto);

    if (editingId) {
      await updateAppointment(editingId, dto);
    } else {
      await addAppointment(dto);
    }

    resetForm();
    loadAppointments();
  };

  const handleEdit = (appointment) => {
    setFormData({
      patientId: appointment.patientId,
      physicianId: appointment.physicianId,
      appointmentTime: appointment.appointmentTime.slice(0, 16),
      status: appointment.status,
      reason: appointment.reason || '',
    });
    setEditingId(appointment.appointmentId);
  };

  const handleDelete = async (id) => {
    await deleteAppointment(id);
    loadAppointments();
  };

  const resetForm = () => {
    setFormData({
      patientId: isPatient ? user.patientId : '',
      physicianId: isPhysician ? user.physicianId : '',
      appointmentTime: '',
      status: '',
      reason: '',
    });
    setEditingId(null);
  };

  return (
    <div className="p-4 flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Appointment' : 'Add Appointment'}</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full">
        {/* Patient Select (Hidden for Patients) */}
        {!isPatient && (
          <PatientSelect
            value={formData.patientId}
            onChange={(id) => setFormData({ ...formData, patientId: id })}
          />
        )}

        {/* Physician Select (Hidden for Physicians, but visible for Patients, Admins & Facilities) */}
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
          options={[
            { value: "Scheduled", label: "Scheduled" },
            { value: "Completed", label: "Completed" },
            { value: "Cancelled", label: "Cancelled" },
          ]}
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

        <Button type="submit" fullWidth>
          {editingId ? 'Update Appointment' : 'Add Appointment'}
        </Button>

        {editingId && (
          <Button onClick={resetForm} fullWidth variant="secondary">
            Cancel Edit
          </Button>
        )}
      </form>

      <div className="space-y-4 w-full">
        {appointments.length === 0 && <p className="text-gray-500 text-center">No appointments found.</p>}

        {appointments.map((appointment) => (
          <div key={appointment.appointmentId} className="p-4 border rounded flex justify-between items-center bg-white shadow-md">
            <div>
              <p><strong>Patient:</strong> {appointment.patientName || `ID: ${appointment.patientId}`}</p>
              <p><strong>Physician:</strong> Dr. {appointment.physicianName || appointment.physicianId}</p>
              <p><strong>Date:</strong> {new Date(appointment.appointmentTime).toLocaleString()}</p>
              <p><strong>Status:</strong> {appointment.status}</p>
              {appointment.reason && <p><strong>Reason:</strong> {appointment.reason}</p>}
            </div>

            <div className="flex space-x-2">
              <Button onClick={() => handleEdit(appointment)} variant="warning">Edit</Button>
              <Button onClick={() => handleDelete(appointment.appointmentId)} variant="danger">Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}