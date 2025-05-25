import React, { useEffect, useState } from 'react';
import { fetchUndispensedPrescriptions } from '../../api/prescriptions';
import { addDispensing } from '../../api/dispensing';
import { useAuth } from '../../login/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

export default function RecentDispensingContainer() {
  const { user } = useAuth();
  const pharmacistId = user?.pharmacistId || 1;
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  async function loadPrescriptions() {
    try {
      const data = await fetchUndispensedPrescriptions(); // ✅ Fetch only undispensed prescriptions
      setPrescriptions(data.slice(0, 4)); // ✅ Show only the 5 most recent
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    }
  }

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Recent Dispensing</h2>
        <Link
          to="/manage-dispensing"
          className="bg-[#609bd8] text-white hover:text-white px-3 py-1 rounded-full hover:bg-[#4e8ac7] transition"
        >
          +
        </Link>
      </div>
      <div className="space-y-4">
        {prescriptions.length === 0 ? (
          <p className="text-gray-500">No more medication to dispense.</p>
        ) : (
          prescriptions.map((p) => (
            <DispensePrescriptionCard
              key={p.prescriptionId}
              prescription={p}
              pharmacistId={pharmacistId}
              refreshPrescriptions={loadPrescriptions} // ✅ Auto-refresh when dispensed
            />
          ))
        )}
      </div>
    </div>
  );
}

function DispensePrescriptionCard({ prescription, pharmacistId, refreshPrescriptions }) {
  const [quantity, setQuantity] = useState('');

  async function handleDispense() {
    if (!quantity) return; // Must have a quantity

    const dto = {
      pharmacistId,
      prescriptionId: Number(prescription.prescriptionId),
      quantity: Number(quantity),
      dispensingNotes: ''
    };

    try {
      await addDispensing(dto);
      refreshPrescriptions(); // ✅ Reload data after dispensing
    } catch (error) {
      console.error('Failed to dispense medication:', error);
      alert('Error dispensing medication');
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{prescription.medicationDetails}</h3>
        <p className="text-gray-700">Patient: {prescription.patientName || `ID: ${prescription.patientId}`}</p>
        <p className="text-gray-600">Dosage: {prescription.dosage}</p>
      </div>
      <input
  type="number"
  placeholder="Quantity"
  value={quantity}
  onChange={(e) => {
    const val = e.target.value;
    if (val === '' || parseInt(val) > 0) {
      setQuantity(val);
    }
  }}
  className="p-2 border rounded w-28"
/>
      <Button onClick={handleDispense} variant="primary">
        Dispense
      </Button>
    </div>
  );
}