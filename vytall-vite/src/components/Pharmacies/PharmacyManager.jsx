import React, { useEffect, useState } from 'react';
import { fetchPharmacies, addPharmacy, updatePharmacy, deletePharmacy } from '../../api/pharmacies';
import Button from '../ui/Button';

export default function PharmacyManager() {
  const [pharmacies, setPharmacies] = useState([]);
  const [formData, setFormData] = useState({ pharmacyName: '', address: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState(null);

  // Fetch pharmacies on component mount
  useEffect(() => {
    loadPharmacies();
  }, []);

  // Load pharmacies from backend
  const loadPharmacies = async () => {
    const data = await fetchPharmacies();
    setPharmacies(data);
  };

  // Submit form (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      pharmacyId: editingId || 0, // Include ID for update, ignore for add (backend can ignore 0)
      pharmacyName: formData.pharmacyName,
      address: formData.address,
      email: formData.email,
      phone: formData.phone,
    };

    if (editingId) {
      await updatePharmacy(editingId, dto);
    } else {
      await addPharmacy(dto);
    }

    resetForm();
    loadPharmacies();
  };

  // Prepare form for editing
  const handleEdit = (pharmacy) => {
    setFormData({
      pharmacyName: pharmacy.pharmacyName,
      address: pharmacy.address,
      email: pharmacy.email,
      phone: pharmacy.phone,
    });
    setEditingId(pharmacy.pharmacyId);
  };

  // Handle delete
  const handleDelete = async (id) => {
    await deletePharmacy(id);
    loadPharmacies();
  };

  // Reset form
  const resetForm = () => {
    setFormData({ pharmacyName: '', address: '', email: '', phone: '' });
    setEditingId(null);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Pharmacy' : 'Add Pharmacy'}</h2>
        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Pharmacy Name"
            value={formData.pharmacyName}
            onChange={(e) => setFormData({ ...formData, pharmacyName: e.target.value })}
            className="w-full p-2 border rounded"
            required
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
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

          <Button type="submit" fullWidth>
            {editingId ? 'Update Pharmacy' : 'Add Pharmacy'}
          </Button>

          {editingId && (
            <Button onClick={resetForm} fullWidth variant="secondary">
              Cancel Edit
            </Button>
          )}
        </form>
        {/* PHARMACIES LIST */}
        <div className="space-y-4 w-full">
          {pharmacies.map((pharmacy) => (
            <div
              key={pharmacy.pharmacyId}
              className="p-4 border rounded flex justify-between items-center bg-white shadow-md"
            >
              <div>
                <p className="font-semibold">{pharmacy.pharmacyName}</p>
                <p><strong>Address:</strong> {pharmacy.address}</p>
                <p><strong>Email:</strong> {pharmacy.email}</p>
                <p><strong>Phone:</strong> {pharmacy.phone}</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleEdit(pharmacy)} variant="warning">Edit</Button>
                <Button onClick={() => handleDelete(pharmacy.pharmacyId)} variant="danger">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}