import React, { useEffect, useState } from 'react';
import { fetchPrescriptions, fetchAllPrescriptions, addPrescription, updatePrescription, deletePrescription } from '../../api/prescriptions';
import Button from '../ui/Button';
import PatientSelect from '../ui/Forms/PatientSelect';
import PhysicianSelect from '../ui/Forms/PhysicianSelect';
import { useAuth } from '../../login/AuthContext';

export default function PrescriptionsManager({ patientId }) {
  const { user } = useAuth();
  const isPhysician = user?.role === "Physician";
  const isAdmin = user?.role === "Admin";

  const [prescriptions, setPrescriptions] = useState([]);
  const [formData, setFormData] = useState({
    patientId: patientId || '',
    medications: [{ medicationDetails: '', dosage: '', frequency: '' }],
    expirationDate: '',
    issuedDate: '',
    physicianId: isPhysician ? String(user.physicianId) : '',
    notes: '',
  });
  const [editingId, setEditingId] = useState(null);

  // Load prescriptions when component mounts or patientId changes
  useEffect(() => {
    loadPrescriptions();
  }, [patientId]);

  const loadPrescriptions = async () => {
    try {
      let data = [];
      if (isAdmin) {
        data = await fetchAllPrescriptions();
      } else if (isPhysician) {
        data = await fetchPrescriptions(user.physicianId);
      }
      
      // Filter by patientId if provided
      if (patientId) {
        data = data.filter(p => p.patientId === parseInt(patientId));
      }
      
      console.log("Fetched prescriptions:", data);
      setPrescriptions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load prescriptions:", error);
      setPrescriptions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      patientId: parseInt(formData.patientId, 10),
      medications: formData.medications.map(med => ({
        medicationDetails: med.medicationDetails,
        dosage: med.dosage,
        frequency: med.frequency
      })),
      expirationDate: formData.expirationDate,
      physicianId: isPhysician
        ? user.physicianId
        : formData.physicianId
          ? parseInt(formData.physicianId, 10)
          : null,
      notes: formData.notes,
      ...(editingId && { issuedDate: formData.issuedDate })
    };

    console.log("DTO to send:", dto);

    try {
      if (editingId) {
        await updatePrescription(editingId, dto);
      } else {
        await addPrescription(
          isPhysician ? user.physicianId : parseInt(formData.physicianId, 10),
          dto
        );
      }
      resetForm();
      loadPrescriptions();
    } catch (error) {
      console.error("Failed to save prescription:", error);
    }
  };

  const handleEdit = (prescription) => {
    setFormData({
      patientId: String(prescription.patientId),
      medications: prescription.medications.map(med => ({
        medicationDetails: med.medicationDetails,
        dosage: med.dosage,
        frequency: med.frequency
      })),
      expirationDate: prescription.expirationDate?.split('T')[0] || '',
      physicianId: isPhysician ? String(user.physicianId) : String(prescription.physicianId),
      issuedDate: prescription.issuedDate, // ✅ Keep this for re-submitting
      notes: prescription.notes,
    });
    setEditingId(prescription.prescriptionId);
  };

  const handleDelete = async (id) => {
    console.log("Deleting prescription ID:", id);
    await deletePrescription(id);
    loadPrescriptions();
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { medicationDetails: '', dosage: '', frequency: '' }]
    }));
  };

  const removeMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const updateMedication = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      medications: [{ medicationDetails: '', dosage: '', frequency: '' }],
      expirationDate: '',
      physicianId: isPhysician ? String(user.physicianId) : '',
      notes: '',
    });
    setEditingId(null);
  };

  return (
    <div className="p-4 flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? 'Edit Prescription' : 'Add Prescription'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full mb-8">
        {!patientId && (
          <PatientSelect
            value={formData.patientId}
            onChange={(id) => setFormData({ ...formData, patientId: id })}
          />
        )}
        {isAdmin && (
          <PhysicianSelect
            value={formData.physicianId}
            onChange={(id) => setFormData({ ...formData, physicianId: id })}
          />
        )}

        <div className="space-y-4">
          {formData.medications.map((medication, index) => (
            <div key={index} className="p-4 border rounded-lg relative">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              )}
              <h3 className="font-semibold mb-2">Medication {index + 1}</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Medication Details"
                  value={medication.medicationDetails}
                  onChange={(e) => updateMedication(index, 'medicationDetails', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={medication.dosage}
                  onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={medication.frequency}
                  onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addMedication}
            className="w-full p-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
          >
            + Add Another Medication
          </button>
        </div>

        <textarea
          placeholder="Additional Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-2 border rounded"
          rows="3"
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
        {(prescriptions || []).map((prescription) => (
          <div
            key={prescription.prescriptionId}
            className="p-4 border rounded flex flex-col gap-4 bg-white shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">
                  <strong>Patient:</strong> {prescription.patientName}
                </p>
                {user?.role === 'Admin' && (
                  <p>
                    <strong>Physician:</strong> Dr. {prescription.physicianName || `ID: ${prescription.physicianId}`}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleEdit(prescription)} variant="warning">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(prescription.prescriptionId)} variant="danger">
                  Delete
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {(prescription.medications || []).map((medication, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <p><strong>Medication {index + 1}:</strong> {medication.medicationDetails}</p>
                  <p><strong>Dosage:</strong> {medication.dosage}</p>
                  <p><strong>Frequency:</strong> {medication.frequency}</p>
                </div>
              ))}
            </div>

            {prescription.notes && (
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <p><strong>Notes:</strong> {prescription.notes}</p>
              </div>
            )}

            <p className="text-sm text-gray-600">
              <strong>Expires:</strong> {prescription.expirationDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}