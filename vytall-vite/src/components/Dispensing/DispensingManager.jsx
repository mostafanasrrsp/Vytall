import React, { useEffect, useState } from 'react';
import {
  fetchDispensings,
  addDispensing,
  updateDispensing,
  deleteDispensing
} from '../../api/dispensing';
import { fetchUndispensedPrescriptions } from '../../api/prescriptions';
import { fetchPharmacists } from '../../api/pharmacists';
import { useAuth } from '../../login/AuthContext';
import Button from '../ui/Button';
import Select from "react-select";

export default function DispensingManager() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isPharmacist = user?.role === 'Pharmacist';

  const [dispensings, setDispensings] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [pharmacists, setPharmacists] = useState([]);
  const [formData, setFormData] = useState({
    prescriptionId: '',
    medications: [], // Array of { medicationId, quantity }
    dispensingNotes: '',
    pharmacistId: isPharmacist ? user.pharmacistId : ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadDispensings();
    loadPrescriptions();
    if (isAdmin) loadPharmacists();
  }, []);

  const loadDispensings = async () => {
    const data = await fetchDispensings();
    setDispensings(data);
  };

  const loadPrescriptions = async () => {
    const data = await fetchUndispensedPrescriptions();
    setPrescriptions(data);
  };

  const loadPharmacists = async () => {
    const data = await fetchPharmacists();
    const options = data.map((p) => ({
      value: p.id,
      label: `Pharmacist ${p.name}`
    }));
    setPharmacists(options);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that at least one medication has a quantity
    if (!formData.medications.some(med => med.quantity > 0)) {
      alert('Please specify quantities for at least one medication');
      return;
    }

    const dto = {
      pharmacistId: isPharmacist
        ? user.pharmacistId
        : parseInt(formData.pharmacistId),
      prescriptionId: parseInt(formData.prescriptionId),
      medications: formData.medications.filter(med => med.quantity > 0),
      dispensingNotes: formData.dispensingNotes || ''
    };

    try {
      if (editingId) {
        await updateDispensing(editingId, dto);
      } else {
        await addDispensing(dto);
      }
      resetForm();
      loadDispensings();
      loadPrescriptions();
    } catch (error) {
      console.error('Failed to save dispensing:', error);
    }
  };

  const handlePrescriptionSelect = (selected) => {
    const prescription = prescriptions.find(p => p.prescriptionId === parseInt(selected.value));
    if (prescription) {
      setFormData(prev => ({
        ...prev,
        prescriptionId: selected.value,
        medications: prescription.medications.map(med => ({
          medicationId: med.medicationId,
          medicationDetails: med.medicationDetails,
          quantity: 0
        }))
      }));
    }
  };

  const updateMedicationQuantity = (medicationId, quantity) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map(med => 
        med.medicationId === medicationId 
          ? { ...med, quantity: parseInt(quantity) || 0 }
          : med
      )
    }));
  };

  const handleEdit = (dispensing) => {
    setFormData({
      prescriptionId: String(dispensing.prescriptionId),
      medications: dispensing.medications.map(med => ({
        medicationId: med.medicationId,
        medicationDetails: med.medicationDetails,
        quantity: med.quantity
      })),
      dispensingNotes: dispensing.notes || '',
      pharmacistId: dispensing.pharmacistId
    });
    setEditingId(dispensing.dispensingId);
  };

  const handleDelete = async (id) => {
    await deleteDispensing(id);
    loadDispensings();
    loadPrescriptions();
  };

  const resetForm = () => {
    setFormData({
      prescriptionId: '',
      medications: [],
      dispensingNotes: '',
      pharmacistId: isPharmacist ? user.pharmacistId : ''
    });
    setEditingId(null);
  };

  return (
    <div className="p-4 w-full flex flex-col gap-6 max-w-5xl" style={{ overflow: "visible" }}>
      <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Dispensing' : 'Dispense Medication'}</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full">
        <Select
          options={prescriptions.map((p) => ({
            value: p.prescriptionId,
            label: `${p.patientName} - ${p.medications.length} medications`
          }))}
          value={
            prescriptions
              .map((p) => ({
                value: String(p.prescriptionId),
                label: `${p.patientName} - ${p.medications.length} medications`
              }))
              .find((opt) => String(opt.value) === String(formData.prescriptionId)) || null
          }
          onChange={handlePrescriptionSelect}
          placeholder="Select Prescription"
          isSearchable
          styles={{ control: (base) => ({ ...base, zIndex: 10 }) }}
        />

        {isAdmin && (
          <Select
            options={pharmacists}
            value={pharmacists.find((opt) => opt.value === formData.pharmacistId) || null}
            onChange={(selected) =>
              setFormData({ ...formData, pharmacistId: selected?.value || '' })
            }
            placeholder="Select Pharmacist"
            isSearchable
            styles={{ control: (base) => ({ ...base, zIndex: 10 }) }}
          />
        )}

        {formData.medications.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Medications to Dispense</h3>
            {formData.medications.map((medication) => (
              <div key={medication.medicationId} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{medication.medicationDetails}</h4>
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-600">Quantity:</label>
                  <input
                    type="number"
                    min="0"
                    value={medication.quantity}
                    onChange={(e) => updateMedicationQuantity(medication.medicationId, e.target.value)}
                    className="w-24 p-2 border rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <textarea
          placeholder="Dispensing Notes"
          value={formData.dispensingNotes}
          onChange={(e) => setFormData({ ...formData, dispensingNotes: e.target.value })}
          className="w-full p-2 border rounded"
          rows="3"
        />

        <Button type="submit" fullWidth>
          {editingId ? 'Update Dispensing' : 'Dispense Medications'}
        </Button>

        {editingId && (
          <Button onClick={resetForm} fullWidth variant="secondary">
            Cancel Edit
          </Button>
        )}
      </form>

      {/* Dispensing History */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Dispensing History</h3>
        {dispensings.map((dispensing) => (
          <div key={dispensing.dispensingId} className="p-4 border rounded-lg bg-white shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold">Patient: {dispensing.patientName}</p>
                <p className="text-sm text-gray-600">
                  Dispensed by: {dispensing.pharmacistName}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(dispensing.dispensingDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleEdit(dispensing)} variant="warning">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(dispensing.dispensingId)} variant="danger">
                  Delete
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {dispensing.medications.map((med, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded">
                  <p><strong>Medication:</strong> {med.medicationDetails}</p>
                  <p><strong>Quantity:</strong> {med.quantity}</p>
                </div>
              ))}
            </div>

            {dispensing.dispensingNotes && (
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <p><strong>Notes:</strong> {dispensing.dispensingNotes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}