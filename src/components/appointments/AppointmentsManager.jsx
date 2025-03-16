import React, { useEffect, useState } from 'react';
import { fetchAppointments, addAppointment, updateAppointment, deleteAppointment } from '../../api/appointments';
import Button from '../ui/Button';

export default function AppointmentsManager() {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    physicianId: '',
    appointmentTime: '',
    status: '',
    reason: '' // Optional, in case you decide to use this field later
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch appointments on mount
  useEffect(() => {
    loadAppointments();
  }, []);

  // Fetch from backend
  const loadAppointments = async () => {
    const data = await fetchAppointments();
    setAppointments(data);
  };

  // Handle add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const dto = {
      appointmentId: editingId || 0, // ✅ Add this line: 0 for new, real id for update
      patientId: Number(formData.patientId), // Ensure numbers are sent properly
      physicianId: Number(formData.physicianId),
      appointmentTime: formData.appointmentTime, // ISO 8601 format
      status: formData.status,
      reason: formData.reason || null, // Optional
    };
  
    if (editingId) {
      await updateAppointment(editingId, dto); // ✅ Editing existing
    } else {
      await addAppointment(dto); // ✅ Adding new
    }
  
    resetForm();
    loadAppointments();
  };

  // Prepare for editing
  const handleEdit = (appointment) => {
    setFormData({
      patientId: appointment.patientId,
      physicianId: appointment.physicianId,
      appointmentTime: appointment.appointmentTime.slice(0, 16), // For datetime-local format (trim seconds/millis)
      status: appointment.status,
      reason: appointment.reason || ''
    });
    setEditingId(appointment.appointmentId);
  };

  // Delete
  const handleDelete = async (id) => {
    await deleteAppointment(id);
    loadAppointments();
  };

  // Reset form to empty state
  const resetForm = () => {
    setFormData({
      patientId: '',
      physicianId: '',
      appointmentTime: '',
      status: '',
      reason: ''
    });
    setEditingId(null);
  };

  return (
    <div className="p-4 flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Appointment' : 'Add Appointment'}</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full">
        <input
          type="number"
          placeholder="Patient ID"
          value={formData.patientId}
          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Physician ID"
          value={formData.physicianId}
          onChange={(e) => setFormData({ ...formData, physicianId: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="datetime-local"
          value={formData.appointmentTime}
          onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full p-2 border rounded"
          required
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

      {/* LIST */}
      <div className="space-y-4 w-full">
        {appointments.map((appointment) => (
          <div
            key={appointment.appointmentId}
            className="p-4 border rounded flex justify-between items-center bg-white shadow-md"
          >
            <div>
              <p><strong>Patient ID:</strong> {appointment.patientId}</p>
              <p><strong>Physician ID:</strong> {appointment.physicianId}</p>
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