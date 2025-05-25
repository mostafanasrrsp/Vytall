// src/components/dispensing/Dispensing.jsx
import { useEffect, useState } from 'react';
import DispensingCard from './DispensingCard'; // To be created
import { fetchDispensings } from '../../api/dispensing';

export default function Dispensing() {
  const [dispensings, setDispensings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDispensings()
      .then(data => setDispensings(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading dispensing records...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4 p-4">
      {dispensings.length === 0 ? (
        <p className="text-gray-500">No dispensing records found.</p>
      ) : (
        dispensings.map((record) => (
          <DispensingCard key={record.id} dispensing={record} />
        ))
      )}
    </div>
  );
}