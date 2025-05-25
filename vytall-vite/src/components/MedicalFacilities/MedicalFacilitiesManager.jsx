import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { fetchMedicalFacilities, addMedicalFacility, updateMedicalFacility, deleteMedicalFacility } from '../../api/medicalFacilities';
import Button from '../ui/Button';

// Define the options for facility types
const facilityTypes = [
  { value: 'Clinic', label: 'Clinic' },
  { value: 'Hospital', label: 'Hospital' },
];

export default function MedicalFacilitiesManager() {
  const [facilities, setFacilities] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '', // Will store "Clinic" or "Hospital"
    address: '',
    email: '',
    phone: '',
    operatingHours: '',
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch facilities on load
  useEffect(() => {
    loadFacilities();
  }, []);

  // Load function
  const loadFacilities = async () => {
    const data = await fetchMedicalFacilities();
    setFacilities(data);
  };

  // Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      name: formData.name,
      type: formData.type,
      address: formData.address,
      email: formData.email || null,
      phone: formData.phone,
      operatingHours: formData.operatingHours,
    };

    if (editingId) {
      dto.facilityId = editingId; // Include ID for update
      await updateMedicalFacility(editingId, dto);
    } else {
      await addMedicalFacility(dto);
    }

    resetForm();
    loadFacilities();
  };

  // Handle Edit (prepare form)
  const handleEdit = (facility) => {
    setFormData({
      name: facility.name,
      type: facility.type,
      address: facility.address,
      email: facility.email || '',
      phone: facility.phone,
      operatingHours: facility.operatingHours,
    });
    setEditingId(facility.facilityId);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    await deleteMedicalFacility(id);
    loadFacilities();
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      address: '',
      email: '',
      phone: '',
      operatingHours: '',
    });
    setEditingId(null);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Medical Facility' : 'Add Medical Facility'}</h2>
        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Facility Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />

          {/* Replace plain text input with react-select for Facility Type */}
          <Select
            options={facilityTypes}
            placeholder="Select Facility Type"
            value={facilityTypes.find(option => option.value === formData.type) || null}
            onChange={(selectedOption) => setFormData({ ...formData, type: selectedOption ? selectedOption.value : '' })}
            className="w-full"
            styles={{
              control: (provided) => ({
                ...provided,
                borderColor: '#d1d5db', // Tailwind gray-300
              }),
            }}
          />

          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Operating Hours (e.g., 9AM-5PM)"
            value={formData.operatingHours}
            onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />

          <Button type="submit" fullWidth>
            {editingId ? 'Update Facility' : 'Add Facility'}
          </Button>

          {editingId && (
            <Button onClick={resetForm} fullWidth variant="secondary">
              Cancel Edit
            </Button>
          )}
        </form>
        {/* FACILITIES LIST */}
        <div className="space-y-4 w-full">
          {facilities.map((facility) => (
            <div
              key={facility.facilityId}
              className="p-4 border rounded flex justify-between items-center bg-white shadow-md"
            >
              <div>
                <p className="font-semibold text-lg">{facility.name}</p>
                <p><strong>Type:</strong> {facility.type}</p>
                <p><strong>Address:</strong> {facility.address}</p>
                <p><strong>Phone:</strong> {facility.phone}</p>
                {facility.email && <p><strong>Email:</strong> {facility.email}</p>}
                <p><strong>Hours:</strong> {facility.operatingHours}</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleEdit(facility)} variant="warning">Edit</Button>
                <Button onClick={() => handleDelete(facility.facilityId)} variant="danger">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}