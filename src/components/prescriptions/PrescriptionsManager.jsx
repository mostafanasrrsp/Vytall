import React, { useEffect, useState } from 'react';
import { fetchPrescriptions, addPrescription, updatePrescription, deletePrescription } from '../../api/prescriptions';
import Button from '../ui/Button';

export default function PrescriptionsManager() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    medicationDetails: '',
    dosage: '',
    frequency: '',
    expirationDate: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Load prescriptions when component mounts
  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    const data = await fetchPrescriptions(); // Physician ID assumed = 1
    console.log("Fetched prescriptions:", data);
    setPrescriptions(data);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      patientId: parseInt(formData.patientId, 10),
      medicationDetails: formData.medicationDetails,
      dosage: formData.dosage,
      frequency: formData.frequency,
      expirationDate: formData.expirationDate,
      physicianId: 1 // Hardcoded to match backend model
    };

    console.log("DTO to send:", dto);

    if (editingId) {
      console.log("Updating prescription ID:", editingId);
      await updatePrescription(editingId, dto);
    } else {
      console.log("Adding new prescription");
      await addPrescription(1, dto); // Hardcoded physician ID for adding
    }

    resetForm();
    loadPrescriptions();
  };

  // Handle edit
  const handleEdit = (prescription) => {
    console.log("Editing prescription:", prescription);
    setFormData({
      patientId: prescription.patientId, // Auto-fill and read-only when editing
      medicationDetails: prescription.medicationDetails,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      expirationDate: prescription.expirationDate?.split('T')[0] || ''
    });
    setEditingId(prescription.prescriptionId);
  };

  // Handle delete
  const handleDelete = async (id) => {
    console.log("Deleting prescription ID:", id);
    await deletePrescription(id);
    loadPrescriptions();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      patientId: '',
      medicationDetails: '',
      dosage: '',
      frequency: '',
      expirationDate: ''
    });
    setEditingId(null);
  };

  return (
    <div className="p-4 flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Prescription' : 'Add Prescription'}</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full">
        <input
          type="number"
          placeholder="Patient ID"
          value={formData.patientId}
          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
          className="w-full p-2 border rounded"
          required
          readOnly={!!editingId} // Read-only on edit
        />
        <input
          type="text"
          placeholder="Medication Details"
          value={formData.medicationDetails}
          onChange={(e) => setFormData({ ...formData, medicationDetails: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Dosage"
          value={formData.dosage}
          onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Frequency"
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          placeholder="Expiration Date"
          value={formData.expirationDate}
          onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <Button type="submit" fullWidth>
          {editingId ? 'Update Prescription' : 'Add Prescription'}
        </Button>

        {editingId && (
          <Button onClick={resetForm} fullWidth variant="secondary">
            Cancel Edit
          </Button>
        )}
      </form>

      {/* LIST */}
      <div className="space-y-4 w-full">
        {prescriptions.map((prescription) => (
          <div key={prescription.prescriptionId} className="p-4 border rounded flex justify-between items-center bg-white shadow-md">
            <div>
              <p className="font-semibold"><strong>Patient:</strong> {prescription.patientName}</p>
              <p><strong>Medication:</strong> {prescription.medicationDetails}</p>
              <p><strong>Dosage:</strong> {prescription.dosage}</p>
              <p><strong>Frequency:</strong> {prescription.frequency}</p>
              <p><strong>Expires:</strong> {prescription.expirationDate}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleEdit(prescription)} variant="warning">Edit</Button>
              <Button onClick={() => handleDelete(prescription.prescriptionId)} variant="danger">Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}