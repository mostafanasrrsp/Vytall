// src/components/prescriptions/Prescriptions.jsx
import { useEffect, useState } from 'react';
import PrescriptionCard from './PrescriptionCard';
import { fetchPrescriptions } from '../../api/prescriptions';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrescriptions()
      .then(data => setPrescriptions(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading prescriptions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4 p-4">
      {prescriptions.length === 0 ? (
        <p className="text-gray-500">No prescriptions found.</p>
      ) : (
        prescriptions.map((prescription) => (
          <PrescriptionCard key={prescription.prescriptionId} prescription={prescription} />
        ))
      )}
    </div>
  );
}