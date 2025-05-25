// src/components/diagnosis/Diagnosis.jsx
import { useEffect, useState } from 'react';
import DiagnosisCard from './DiagnosisCard';
import { fetchDiagnoses } from '../../api/diagnoses';

export default function Diagnosis() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDiagnoses()
      .then(data => setDiagnoses(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading diagnoses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4 p-4">
      {diagnoses.length === 0 ? (
        <p className="text-gray-500">No diagnoses found.</p>
      ) : (
        diagnoses.map((diag) => (
          <DiagnosisCard key={diag.id} diagnosis={diag} />
        ))
      )}
    </div>
  );
}