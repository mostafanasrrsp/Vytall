import React, { useState, useEffect } from 'react';
import { useAuth } from '../../login/AuthContext';
import Button from '../ui/Button';
import { FaPlus, FaEdit, FaTrash, FaTruck, FaCheck } from 'react-icons/fa';

export default function ShipmentsManager() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    shipmentNumber: '',
    orderId: '',
    carrier: '',
    trackingNumber: '',
    status: 'pending',
    estimatedDelivery: '',
    destination: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement API call
      const mockData = [
        {
          id: 1,
          shipmentNumber: 'SHP-001',
          orderId: 'ORD-001',
          carrier: 'DHL Express',
          trackingNumber: 'DHL123456789',
          status: 'in_transit',
          estimatedDelivery: '2024-03-25',
          destination: 'Pharmacy A, 123 Medical Center Dr',
          notes: 'Handle with care - Temperature sensitive',
          createdAt: new Date().toISOString()
        },
        // Add more mock data as needed
      ];
      setShipments(mockData);
    } catch (error) {
      console.error("Error loading shipments:", error);
      setError("Failed to load shipments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement API call
      if (editingId) {
        // Update existing shipment
        const updatedShipments = shipments.map(shipment =>
          shipment.id === editingId ? { ...shipment, ...formData } : shipment
        );
        setShipments(updatedShipments);
      } else {
        // Add new shipment
        const newShipment = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        setShipments([...shipments, newShipment]);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving shipment:", error);
      setError("Failed to save shipment. Please try again.");
    }
  };

  const handleEdit = (shipment) => {
    setFormData(shipment);
    setEditingId(shipment.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      // TODO: Implement API call
      setShipments(shipments.filter(shipment => shipment.id !== id));
    } catch (error) {
      console.error("Error deleting shipment:", error);
      setError("Failed to delete shipment. Please try again.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // TODO: Implement API call
      const updatedShipments = shipments.map(shipment =>
        shipment.id === id ? { ...shipment, status: newStatus } : shipment
      );
      setShipments(updatedShipments);
    } catch (error) {
      console.error("Error updating shipment status:", error);
      setError("Failed to update shipment status. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      shipmentNumber: '',
      orderId: '',
      carrier: '',
      trackingNumber: '',
      status: 'pending',
      estimatedDelivery: '',
      destination: '',
      notes: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusBadgeClass = (status) => {
    const baseClass = "px-2 py-1 rounded-full text-sm";
    switch (status) {
      case 'pending':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'in_transit':
        return `${baseClass} bg-blue-100 text-blue-800`;
      case 'delivered':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) return <div className="text-center py-4">Loading shipments...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Shipment Management</h1>
            <p className="text-gray-600">Track and manage warehouse shipments</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center"
          >
            <FaPlus className="mr-2" />
            New Shipment
          </Button>
        </div>

        {showForm && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Shipment' : 'Create New Shipment'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Shipment Number</label>
                <input
                  type="text"
                  value={formData.shipmentNumber}
                  onChange={(e) => setFormData({ ...formData, shipmentNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Order ID</label>
                <input
                  type="text"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Carrier</label>
                <input
                  type="text"
                  value={formData.carrier}
                  onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
                <input
                  type="text"
                  value={formData.trackingNumber}
                  onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Delivery</label>
                <input
                  type="date"
                  value={formData.estimatedDelivery}
                  onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="md:col-span-2 flex justify-end space-x-2">
                <Button onClick={resetForm} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update' : 'Create'} Shipment
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Delivery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{shipment.shipmentNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{shipment.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{shipment.carrier}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadgeClass(shipment.status)}>
                        {shipment.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{shipment.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(shipment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(shipment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                        {shipment.status === 'in_transit' && (
                          <button
                            onClick={() => handleStatusChange(shipment.id, 'delivered')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FaCheck />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 