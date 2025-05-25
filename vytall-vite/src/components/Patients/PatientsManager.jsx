import React, { useEffect, useState } from 'react';
import { fetchPatients, addPatient, updatePatient, deletePatient } from '../../api/patients';
import Button from '../ui/Button';

export default function PatientsManager() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    medicalHistory: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Load patients on component mount
  useEffect(() => {
    loadPatients();
  }, []);

  // Fetch patients from backend
  const loadPatients = async () => {
    const data = await fetchPatients();
    setPatients(data);
  };

  // Handle form submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updatePatient(editingId, formData);
    } else {
      await addPatient(formData);
    }
    resetForm();
    loadPatients();
  };

  // Handle edit button
  const handleEdit = (patient) => {
    const [firstName, lastName] = (patient.name || '').split(' ');
    const [email, phone] = (patient.contact || '').split(' | ');

    setFormData({
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      phone: phone || '',
      dateOfBirth: patient.dateOfBirth || '',
      medicalHistory: patient.medicalHistory || '',
    });
    setEditingId(patient.id); // Store ID for updating
  };

  // Handle delete button
  const handleDelete = async (id) => {
    await deletePatient(id);
    loadPatients();
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      medicalHistory: '',
    });
    setEditingId(null);
  };

  return (
    <div className="flex flex-col w-full">
      {/* FORM CONTAINER */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-bold mb-4">{editingId !== null ? 'Edit Patient' : 'Add Patient'}</h2>
        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 w-full mb-8">
          {[
            { key: 'firstName', label: 'First Name' },
            { key: 'lastName', label: 'Last Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' }
          ].map(({ key, label }) => (
            <div key={key}>
              <input
                type="text"
                placeholder={label}
                value={formData[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          ))}
          <input
            type="date"
            placeholder="Date of Birth"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Medical History"
            value={formData.medicalHistory}
            onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
            className="w-full p-2 border rounded"
          />

          <Button type="submit" fullWidth>
            {editingId !== null ? 'Update Patient' : 'Add Patient'}
          </Button>

          {editingId !== null && (
            <Button onClick={resetForm} fullWidth variant="secondary">
              Cancel Edit
            </Button>
          )}
        </form>
      </div>

      {/* PATIENT CARDS LIST */}
      <div className="space-y-4 w-full max-w-4xl">
        {patients.map((patient, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 flex justify-between items-center w-full"
          >
            <div>
              <p className="font-semibold">{patient.name}</p>
              <p><strong>Contact:</strong> {patient.contact}</p>
              <p><strong>Date of Birth:</strong> {patient.dateOfBirth}</p>
              {patient.medicalHistory && (
                <p><strong>Medical History:</strong> {patient.medicalHistory}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleEdit(patient)} variant="warning">
                Edit
              </Button>
              <Button onClick={() => handleDelete(patient.id)} variant="danger">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}