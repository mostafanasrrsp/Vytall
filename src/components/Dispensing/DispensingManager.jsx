import React, { useEffect, useState } from 'react';
import { fetchDispensings, addDispensing, updateDispensing, deleteDispensing } from '../../api/dispensing';
import { fetchPrescriptions } from '../../api/prescriptions';
import Button from '../ui/Button';

export default function DispensingManager() {
  const [dispensings, setDispensings] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [formData, setFormData] = useState({
    prescriptionId: '',
    quantity: '',
    dispensingNotes: '' // ✅ Always initialized as string
  });
  const [editingId, setEditingId] = useState(null);

  const pharmacistId = 1; // Static for now

  // Load data on mount
  useEffect(() => {
    loadDispensings();
    loadPrescriptions();
  }, []);

  // Fetch all dispensings
  const loadDispensings = async () => {
    try {
      const data = await fetchDispensings();
      setDispensings(data);
    } catch (error) {
      console.error('Failed to fetch dispensings:', error);
    }
  };

  // Fetch all prescriptions for dropdown
  const loadPrescriptions = async () => {
    try {
      const data = await fetchPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    }
  };

  // Handle Add / Update dispensing
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      pharmacistId: pharmacistId,
      prescriptionId: Number(formData.prescriptionId),
      quantity: Number(formData.quantity),
      dispensingNotes: formData.dispensingNotes || '' // ✅ Always send empty string if nothing entered
    };

    console.log('Submitting DTO:', dto); // For debugging purpose

    try {
      if (editingId) {
        await updateDispensing(editingId, dto);
      } else {
        await addDispensing(dto);
      }
      resetForm();
      await loadDispensings();
    } catch (error) {
      console.error('Failed to save dispensing:', error);
    }
  };

  // Handle Edit (prefill form)
  const handleEdit = (dispensing) => {
    setFormData({
      prescriptionId: dispensing.prescriptionId,
      quantity: dispensing.quantity !== null ? dispensing.quantity : '', // ✅ Safe fallback
      dispensingNotes: dispensing.notes || '' // ✅ Always string
    });
    setEditingId(dispensing.dispensingId);
  };

  // Handle Delete dispensing (no confirm)
  const handleDelete = async (id) => {
    try {
      await deleteDispensing(id); // ✅ No more confirm
      await loadDispensings();
    } catch (error) {
      console.error('Failed to delete dispensing:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      prescriptionId: '',
      quantity: '',
      dispensingNotes: ''
    });
    setEditingId(null);
  };

  return (
    <div className="p-4 w-full flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Dispensing' : 'Dispense Medication'}</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full">
        {/* Prescription Dropdown */}
        <select
          value={formData.prescriptionId}
          onChange={(e) => setFormData({ ...formData, prescriptionId: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Prescription</option>
          {prescriptions.map((p) => (
            <option key={p.prescriptionId} value={p.prescriptionId}>
              {p.medicationDetails} - {p.patientName}
            </option>
          ))}
        </select>

        {/* Quantity */}
        <input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        {/* Notes */}
        <textarea
          placeholder="Notes (Optional)"
          value={formData.dispensingNotes}
          onChange={(e) => setFormData({ ...formData, dispensingNotes: e.target.value })}
          className="w-full p-2 border rounded"
        />

        {/* Buttons */}
        <Button type="submit" fullWidth>
          {editingId ? 'Update Dispensing' : 'Dispense Medication'}
        </Button>
        {editingId && (
          <Button onClick={resetForm} fullWidth variant="secondary">
            Cancel Edit
          </Button>
        )}
      </form>

      {/* Dispensing List */}
      <div className="space-y-4 w-full">
        {dispensings.map((dispensing) => (
          <div
            key={dispensing.dispensingId}
            className="p-4 border rounded flex justify-between items-start bg-white shadow-md"
          >
            <div className="space-y-1">
              <p><strong>Medication:</strong> {dispensing.medication}</p>
              <p><strong>Patient:</strong> {dispensing.patient}</p>
              <p><strong>Quantity:</strong> {dispensing.quantity}</p>
              <p><strong>Notes:</strong> {dispensing.notes || 'N/A'}</p>
              <p><strong>Dispensed On:</strong> {new Date(dispensing.dispensedOn).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleEdit(dispensing)} variant="warning" small>
                Edit
              </Button>
              <Button onClick={() => handleDelete(dispensing.dispensingId)} variant="danger" small>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}