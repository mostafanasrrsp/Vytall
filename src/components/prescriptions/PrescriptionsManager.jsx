import React, { useEffect, useState } from 'react';
import { fetchPrescriptions, fetchAllPrescriptions, addPrescription, updatePrescription, deletePrescription } from '../../api/prescriptions';
import Button from '../ui/Button';
import PatientSelect from '../ui/Forms/PatientSelect';
import PhysicianSelect from '../ui/Forms/PhysicianSelect';
import { useAuth } from '../../login/AuthContext';

export default function PrescriptionsManager() {
  const { user } = useAuth();
  const isPhysician = user?.role === "Physician";
  const isAdmin = user?.role === "Admin";

  const [prescriptions, setPrescriptions] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    medicationDetails: '',
    dosage: '',
    frequency: '',
    expirationDate: '',
    issuedDate: '',
    physicianId: isPhysician ? String(user.physicianId) : '',
  });
  const [editingId, setEditingId] = useState(null);

  // Load prescriptions when component mounts
  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    let data;
    if (isAdmin) {
      data = await fetchAllPrescriptions();
    } else if (isPhysician) {
      data = await fetchPrescriptions(user.physicianId);
    }
    console.log("Fetched prescriptions:", data);
    setPrescriptions(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      patientId: parseInt(formData.patientId, 10),
      medicationDetails: formData.medicationDetails,
      dosage: formData.dosage,
      frequency: formData.frequency,
      expirationDate: formData.expirationDate,
      physicianId: isPhysician
        ? user.physicianId
        : formData.physicianId
          ? parseInt(formData.physicianId, 10)
          : null,
      ...(editingId && { issuedDate: formData.issuedDate }) // ✅ Only include if editing
    };

    console.log("DTO to send:", dto);

    try {
      if (editingId) {
        await updatePrescription(editingId, dto);
      } else {
        // When adding, if admin then use selected physicianId,
        // if physician then use the authenticated physician's ID.
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
      medicationDetails: prescription.medicationDetails,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      expirationDate: prescription.expirationDate?.split('T')[0] || '',
      physicianId: isPhysician ? String(user.physicianId) : String(prescription.physicianId),
      issuedDate: prescription.issuedDate, // ✅ Keep this for re-submitting
    });
    setEditingId(prescription.prescriptionId);
  };

  const handleDelete = async (id) => {
    console.log("Deleting prescription ID:", id);
    await deletePrescription(id);
    loadPrescriptions();
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      medicationDetails: '',
      dosage: '',
      frequency: '',
      expirationDate: '',
      physicianId: isPhysician ? String(user.physicianId) : '',
    });
    setEditingId(null);
  };

  return (
    <div className="p-4 flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? 'Edit Prescription' : 'Add Prescription'}
      </h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full">
        <PatientSelect
          value={formData.patientId}
          onChange={(id) => setFormData({ ...formData, patientId: id })}
        />
        {/* Only show Physician select for Admins */}
        {isAdmin && (
          <PhysicianSelect
            value={formData.physicianId}
            onChange={(id) => setFormData({ ...formData, physicianId: id })}
          />
        )}
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
          <div
            key={prescription.prescriptionId}
            className="p-4 border rounded flex justify-between items-center bg-white shadow-md"
          >
            <div>
              <p className="font-semibold">
                <strong>Patient:</strong> {prescription.patientName}
              </p>
              <p>
                <strong>Medication:</strong> {prescription.medicationDetails}
              </p>
              <p>
                <strong>Dosage:</strong> {prescription.dosage}
              </p>
              <p>
                <strong>Frequency:</strong> {prescription.frequency}
              </p>
              <p>
                <strong>Expires:</strong> {prescription.expirationDate}
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
        ))}
      </div>
    </div>
  );
}