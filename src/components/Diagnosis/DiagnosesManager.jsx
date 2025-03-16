import React, { useEffect, useState } from 'react';
import { fetchDiagnoses, addDiagnosis, updateDiagnosis, deleteDiagnosis } from '../../api/diagnoses';
import Button from '../ui/Button';

export default function DiagnosisManager() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    appointmentId: '',
    details: '',
    physicianId: '' 
  });
  const [editingId, setEditingId] = useState(null);

  const physicianId = 1; // ✅ Static or dynamic physician ID

  // Load diagnoses on component mount
  useEffect(() => {
    loadDiagnoses();
  }, []);

  const loadDiagnoses = async () => {
    try {
      const data = await fetchDiagnoses();
      console.log('Fetched diagnoses:', data);
      setDiagnoses(data);
    } catch (error) {
      console.error('Failed to fetch diagnoses:', error);
    }
  };

  // Handle form submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      patientId: parseInt(formData.patientId, 10),
      appointmentId: formData.appointmentId ? parseInt(formData.appointmentId, 10) : null,
      details: formData.details,
      physicianId: physicianId // Static
    };

    console.log('DTO to send:', dto);

    try {
      if (editingId) {
        console.log('Updating diagnosis ID:', editingId);
        await updateDiagnosis(editingId, dto);
      } else {
        console.log('Adding new diagnosis');
        await addDiagnosis(dto);
      }

      resetForm();
      loadDiagnoses();
    } catch (error) {
      console.error('Failed to save diagnosis:', error);
    }
  };

  // Handle edit (prefill form)
  const handleEdit = (diagnosis) => {
    console.log('Editing diagnosis:', diagnosis);
    setFormData({
      patientId: diagnosis.patientId,
      appointmentId: diagnosis.appointmentId || '',
      details: diagnosis.details,
      physicianId: diagnosis.physicianId // ✅ Add this line
    });
    setEditingId(diagnosis.diagnosisId);
  };

  // Handle delete
  const handleDelete = async (id) => {
    console.log('Deleting diagnosis ID:', id);
    await deleteDiagnosis(id);
    loadDiagnoses();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      patientId: '',
      appointmentId: '',
      details: ''
    });
    setEditingId(null);
  };

  return (
    <div className="p-4 flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Diagnosis' : 'Add Diagnosis'}</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full">
        <input
          type="number"
          placeholder="Patient ID"
          value={formData.patientId}
          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
          className="w-full p-2 border rounded"
          required
          readOnly={!!editingId} // ✅ Lock Patient ID on edit
        />
        <input
          type="number"
          placeholder="Appointment ID (Optional)"
          value={formData.appointmentId}
          onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Diagnosis Details"
          value={formData.details}
          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <Button type="submit" fullWidth>
          {editingId ? 'Update Diagnosis' : 'Add Diagnosis'}
        </Button>

        {editingId && (
          <Button onClick={resetForm} fullWidth variant="secondary">
            Cancel Edit
          </Button>
        )}
      </form>

      {/* LIST */}
      <div className="space-y-4 w-full">
        {diagnoses.map((diagnosis) => (
          <div key={diagnosis.diagnosisId} className="p-4 border rounded flex justify-between items-start bg-white shadow-md">
            <div className="space-y-1">
              <p><strong>Patient:</strong> {diagnosis.patient}</p>
              <p><strong>Physician:</strong> {diagnosis.physician}</p>
              <p><strong>Appointment ID:</strong> {diagnosis.appointmentId || 'N/A'}</p>
              <p><strong>Details:</strong> {diagnosis.details}</p>
              <p><strong>Diagnosed On:</strong> {new Date(diagnosis.diagnosedOn).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleEdit(diagnosis)} variant="warning">Edit</Button>
              <Button onClick={() => handleDelete(diagnosis.diagnosisId)} variant="danger">Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}