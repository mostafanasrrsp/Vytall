import { useEffect, useState } from 'react';
import { fetchPrescriptionReminders } from '../../api/prescriptions';
import PrescriptionCard from './PrescriptionCard';
import { useAuth } from '../../login/AuthContext'; // ✅ Import AuthContext

export default function Prescriptions() {
  const { user } = useAuth(); // ✅ Get logged-in user
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.patientId) return; // ✅ Skip if no patientId

    fetchPrescriptionReminders(user.patientId)
      .then((data) => setPrescriptions(data))
      .catch((err) => setError(err.message || "Failed to load prescriptions."))
      .finally(() => setLoading(false));
  }, [user?.patientId]);

  if (loading) return <div className="p-4">Loading prescriptions...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4 p-4">
      {prescriptions.length === 0 ? (
        <p className="text-gray-500">No prescriptions found.</p>
      ) : (
        prescriptions.map((prescription) => (
          <PrescriptionCard
            key={prescription.prescriptionId}
            prescription={prescription}
          />
        ))
      )}
    </div>
  );
}