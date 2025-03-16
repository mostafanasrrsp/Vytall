import React, { useEffect, useState } from 'react';
import { fetchPhysicians, addPhysician, updatePhysician, deletePhysician } from '../../api/physicians';
import Button from '../ui/Button';

export default function PhysiciansManager() {
  const [physicians, setPhysicians] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    email: '',
    phone: '',
  });
  const [editingId, setEditingId] = useState(null);

  // Load physicians when component mounts
  useEffect(() => {
    loadPhysicians();
  }, []);

  // Load all physicians
  const loadPhysicians = async () => {
    const data = await fetchPhysicians();
    console.log("Fetched physicians:", data);
    setPhysicians(data);
  };

  // Handle form submit (Add + Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      specialization: formData.specialization,
      email: formData.email,
      phone: formData.phone,
    };

    console.log("DTO to send:", dto);

    if (editingId) {
      console.log("Updating physician ID:", editingId);
      await updatePhysician(editingId, dto);
    } else {
      console.log("Adding new physician");
      await addPhysician(dto);
    }

    resetForm();
    loadPhysicians();
  };

  // Handle edit button click
  const handleEdit = (physician) => {
    console.log("Editing physician:", physician);

    const [firstName, lastName] = (physician.name || '').split(' ');
    const [email, phone] = (physician.contact || '').split(' | ');

    setFormData({
      firstName: firstName || '',
      lastName: lastName || '',
      specialization: physician.specialty || '',
      email: email || '',
      phone: phone || '',
    });

    setEditingId(physician.id); // ✅ now it will be correctly set
  };

  // Handle delete
  const handleDelete = async (id) => {
    console.log("Deleting physician ID:", id);
    await deletePhysician(id);
    loadPhysicians();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      specialization: '',
      email: '',
      phone: '',
    });
    setEditingId(null);
  };

  return (
    <div className="p-4 flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-bold mb-4">{editingId !== null ? 'Edit Physician' : 'Add Physician'}</h2>

      {/* FORM */}
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
          type="text"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
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
          {editingId !== null ? 'Update Physician' : 'Add Physician'}
        </Button>

        {editingId !== null && (
          <Button onClick={resetForm} fullWidth variant="secondary">
            Cancel Edit
          </Button>
        )}
      </form>

      {/* LIST */}
      <div className="space-y-4 w-full">
        {physicians.map((physician, index) => (
          <div key={index} className="p-4 border rounded flex justify-between items-center bg-white shadow-md">
            <div>
              <p className="font-semibold">{physician.name}</p>
              <p><strong>Specialty:</strong> {physician.specialty}</p>
              <p><strong>Contact:</strong> {physician.contact}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleEdit(physician)} variant="warning">Edit</Button>
              <Button onClick={() => handleDelete(physician.id)} variant="danger">Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}