import React, { useState, useEffect } from 'react';
import { useAuth } from '../../login/AuthContext';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import {
  fetchOTCMedicationsByPatient,
  addOTCMedication,
  updateOTCMedication,
  deleteOTCMedication
} from '../../api/otcMedications';

const OTCMedicationsTracker = ({ patientId }) => {
  const { user } = useAuth();
  const activePatientId = patientId || (user?.role === 'Patient' ? user.patientId : null);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    if (activePatientId) {
      fetchMedications();
    }
  }, [activePatientId]);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const data = await fetchOTCMedicationsByPatient(activePatientId);
      setMedications(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch medications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        patientId: activePatientId
      };
      if (editingMedication) {
        await updateOTCMedication(editingMedication.otcMedicationId, payload);
      } else {
        await addOTCMedication(payload);
      }
      setShowForm(false);
      setEditingMedication(null);
      setFormData({
        medicationName: '',
        dosage: '',
        frequency: '',
        reason: '',
        notes: ''
      });
      fetchMedications();
    } catch (err) {
      setError(err.message || 'Failed to save medication');
    }
  };

  const handleEdit = (medication) => {
    setEditingMedication(medication);
    setFormData({
      medicationName: medication.medicationName,
      dosage: medication.dosage,
      frequency: medication.frequency,
      reason: medication.reason || '',
      notes: medication.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) {
      return;
    }
    try {
      await deleteOTCMedication(id);
      fetchMedications();
    } catch (err) {
      setError(err.message || 'Failed to delete medication');
    }
  };

  if (!activePatientId) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">OTC Medications</h2>
        <div className="text-red-500">
          No patient selected. Please select a patient to view their OTC medications.
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-6">Loading medications...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">OTC Medications</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingMedication(null);
            setFormData({
              medicationName: '',
              dosage: '',
              frequency: '',
              reason: '',
              notes: ''
            });
          }}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <FaPlus className="mr-2" />
          Add Medication
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            {editingMedication ? 'Edit Medication' : 'Add New Medication'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Medication Name</label>
              <input
                type="text"
                required
                value={formData.medicationName}
                onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dosage</label>
              <input
                type="text"
                required
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Frequency</label>
              <input
                type="text"
                required
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingMedication(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {editingMedication ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medications.map((medication) => (
              <tr key={medication.otcMedicationId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{medication.medicationName}</div>
                  {medication.reason && (
                    <div className="text-sm text-gray-500">Reason: {medication.reason}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medication.dosage}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medication.frequency}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medication.startDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    medication.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {medication.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(medication)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(medication.otcMedicationId)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OTCMedicationsTracker; 