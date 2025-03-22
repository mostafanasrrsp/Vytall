import React, { useEffect, useState } from 'react';
import { fetchPharmacists, addPharmacist, updatePharmacist, deletePharmacist } from '../../api/pharmacists';
import Button from '../ui/Button';

export default function PharmacistManager() {
  const [pharmacists, setPharmacists] = useState([]);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState(null);

  // Load pharmacists when component mounts
  useEffect(() => {
    loadPharmacists();
  }, []);

  // Load all pharmacists
  const loadPharmacists = async () => {
    const data = await fetchPharmacists();
    console.log("Fetched pharmacists:", data);
    setPharmacists(data);
  };

  // Handle form submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      pharmacistId: editingId || 0, // ✅ Include pharmacistId when updating
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone
    };

    console.log("DTO to send:", dto);

    if (editingId) {
      console.log("Updating pharmacist ID:", editingId);
      await updatePharmacist(editingId, dto);
    } else {
      console.log("Adding new pharmacist");
      await addPharmacist(dto);
    }

    resetForm();
    loadPharmacists();
  };

  // Handle edit button click
  const handleEdit = (pharmacist) => {
    console.log("Editing pharmacist:", pharmacist);

    // Split name and contact
    const [firstName, lastName] = (pharmacist.name || '').split(' ');
    const [email, phone] = (pharmacist.contact || '').split(' | ');

    setFormData({
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      phone: phone || ''
    });

    setEditingId(pharmacist.id); // ✅ Correct ID
  };

  // Handle delete
  const handleDelete = async (id) => {
    console.log("Deleting pharmacist ID:", id);
    await deletePharmacist(id);
    loadPharmacists();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    });
    setEditingId(null);
  };

  return (
    <div className="p-4 flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Pharmacist' : 'Add Pharmacist'}</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full">
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
          {editingId ? 'Update Pharmacist' : 'Add Pharmacist'}
        </Button>

        {editingId && (
          <Button onClick={resetForm} fullWidth variant="secondary">
            Cancel Edit
          </Button>
        )}
      </form>

      {/* List */}
      <div className="space-y-4 w-full">
        {pharmacists.map((pharmacist) => (
          <div key={pharmacist.id} className="p-4 border rounded flex justify-between items-center bg-white shadow-md">
            <div>
              <p className="font-semibold">{pharmacist.name}</p>
              <p>{pharmacist.contact}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleEdit(pharmacist)} variant="warning">
                Edit
              </Button>
              <Button onClick={() => handleDelete(pharmacist.id)} variant="danger">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}