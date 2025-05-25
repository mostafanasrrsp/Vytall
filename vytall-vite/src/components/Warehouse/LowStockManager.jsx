import React, { useState, useEffect } from 'react';
import { useAuth } from '../../login/AuthContext';
import Button from '../ui/Button';
import { FaExclamationTriangle, FaPlus, FaSync } from 'react-icons/fa';

export default function LowStockManager() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReorderForm, setShowReorderForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reorderQuantity, setReorderQuantity] = useState('');

  useEffect(() => {
    loadLowStockItems();
  }, []);

  const loadLowStockItems = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement API call
      const mockData = [
        {
          id: 1,
          name: 'Paracetamol 500mg',
          sku: 'MED-001',
          currentStock: 100,
          minimumStock: 500,
          reorderPoint: 300,
          unit: 'tablets',
          category: 'Pain Relief',
          location: 'Shelf A1',
          lastReorderDate: '2024-03-01',
          supplier: 'PharmaCorp Inc.',
          status: 'critical' // critical, warning, or normal
        },
        {
          id: 2,
          name: 'Ibuprofen 400mg',
          sku: 'MED-002',
          currentStock: 250,
          minimumStock: 400,
          reorderPoint: 300,
          unit: 'tablets',
          category: 'Pain Relief',
          location: 'Shelf A2',
          lastReorderDate: '2024-03-05',
          supplier: 'MediSupply Ltd.',
          status: 'warning'
        },
        // Add more mock data as needed
      ];
      setItems(mockData);
    } catch (error) {
      console.error("Error loading low stock items:", error);
      setError("Failed to load low stock items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (e) => {
    e.preventDefault();
    if (!selectedItem || !reorderQuantity) return;

    try {
      // TODO: Implement API call
      console.log(`Reordering ${reorderQuantity} units of ${selectedItem.name}`);
      // Update the item's last reorder date
      const updatedItems = items.map(item =>
        item.id === selectedItem.id
          ? { ...item, lastReorderDate: new Date().toISOString().split('T')[0] }
          : item
      );
      setItems(updatedItems);
      resetReorderForm();
    } catch (error) {
      console.error("Error reordering item:", error);
      setError("Failed to reorder item. Please try again.");
    }
  };

  const resetReorderForm = () => {
    setSelectedItem(null);
    setReorderQuantity('');
    setShowReorderForm(false);
  };

  const getStockLevelClass = (status) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const calculateRecommendedOrder = (item) => {
    return item.reorderPoint - item.currentStock;
  };

  if (loading) return <div className="text-center py-4">Loading low stock items...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Low Stock Management</h1>
            <p className="text-gray-600">Monitor and manage items with low inventory levels</p>
          </div>
          <Button
            onClick={loadLowStockItems}
            className="flex items-center"
          >
            <FaSync className="mr-2" />
            Refresh
          </Button>
        </div>

        {showReorderForm && selectedItem && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Reorder {selectedItem.name}</h2>
            <form onSubmit={handleReorder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Recommended Order Quantity: {calculateRecommendedOrder(selectedItem)} {selectedItem.unit}
                </label>
                <input
                  type="number"
                  value={reorderQuantity}
                  onChange={(e) => setReorderQuantity(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="1"
                  required
                  placeholder="Enter quantity to order"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button onClick={resetReorderForm} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit">
                  Place Order
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-4 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${getStockLevelClass(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Current Stock</p>
                  <p className="font-medium">{item.currentStock} {item.unit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Minimum Stock</p>
                  <p className="font-medium">{item.minimumStock} {item.unit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Reorder Point</p>
                  <p className="font-medium">{item.reorderPoint} {item.unit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Reorder</p>
                  <p className="font-medium">{item.lastReorderDate}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-500">Location:</span> {item.location}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Supplier:</span> {item.supplier}
                </p>
              </div>

              {item.currentStock < item.reorderPoint && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex items-center text-yellow-600">
                    <FaExclamationTriangle className="mr-2" />
                    <span className="text-sm">Stock below reorder point</span>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowReorderForm(true);
                    }}
                    size="sm"
                  >
                    Reorder
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 