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
    quantity: '',
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

    const dto = {
      pharmacistId: isPharmacist
        ? user.pharmacistId
        : parseInt(formData.pharmacistId),
      prescriptionId: parseInt(formData.prescriptionId),
      quantity: parseInt(formData.quantity),
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

  const handleEdit = (dispensing) => {
    setFormData({
      prescriptionId: String(dispensing.prescriptionId),
      quantity: dispensing.quantity ?? '',
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
      quantity: '',
      dispensingNotes: '',
      pharmacistId: isPharmacist ? user.pharmacistId : ''
    });
    setEditingId(null);
  };

  return (
    <div className="p-4 w-full flex flex-col gap-6" style={{ overflow: "visible" }}>
      <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Dispensing' : 'Dispense Medication'}</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full">
        {/* ✅ Prescription dropdown */}
        <Select
          options={prescriptions.map((p) => ({
            value: p.prescriptionId,
            label: `${p.medicationDetails} - ${p.patientName}`
          }))}
          value={
            prescriptions
              .map((p) => ({
                value: String(p.prescriptionId), // ensure string
                label: `${p.medicationDetails} - ${p.patientName}`
              }))
              .find((opt) => String(opt.value) === String(formData.prescriptionId)) || null
          }
          onChange={(selected) =>
            setFormData({ ...formData, prescriptionId: selected?.value || '' })
          }
          placeholder="Select Prescription"
          isSearchable
          styles={{ control: (base) => ({ ...base, zIndex: 10 }) }}
        />

        {/* ✅ Pharmacist dropdown only for Admins */}
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

        {/* ✅ Quantity (only positive numbers) */}
        <input
          type="number"
          min={1}
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value.replace(/[^0-9]/g, '') })
          }
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          placeholder="Notes (Optional)"
          value={formData.dispensingNotes}
          onChange={(e) =>
            setFormData({ ...formData, dispensingNotes: e.target.value })
          }
          className="w-full p-2 border rounded"
        />

        <Button type="submit" fullWidth>
          {editingId ? 'Update Dispensing' : 'Dispense Medication'}
        </Button>

        {editingId && (
          <Button onClick={resetForm} fullWidth variant="secondary">
            Cancel Edit
          </Button>
        )}
      </form>

      <div className="space-y-4 w-full">
        {dispensings.map((d) => (
          <div
            key={d.dispensingId}
            className="p-4 border rounded flex justify-between items-start bg-white shadow-md"
          >
            <div className="space-y-1">
              <p><strong>Medication:</strong> {d.medication}</p>
              <p><strong>Patient:</strong> {d.patient}</p>
              <p><strong>Quantity:</strong> {d.quantity}</p>
              <p><strong>Notes:</strong> {d.notes || 'N/A'}</p>
              <p><strong>Dispensed On:</strong> {new Date(d.dispensedOn).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleEdit(d)} variant="warning" small>Edit</Button>
              <Button onClick={() => handleDelete(d.dispensingId)} variant="danger" small>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}