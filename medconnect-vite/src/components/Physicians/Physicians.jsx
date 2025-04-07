// src/components/physicians/Physicians.jsx
import { useEffect, useState } from 'react';
import PhysicianCard from './PhysicianCard';
import { fetchPhysicians }from '../../api/physicians';

export default function Physicians() {
  const [physicians, setPhysicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPhysicians()
      .then(data => setPhysicians(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading physicians...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4 p-4">
      {physicians.length === 0 ? (
        <p className="text-gray-500">No physicians found.</p>
      ) : (
        physicians.map((physician) => (
          <PhysicianCard key={physician.id} physician={physician} />
        ))
      )}
    </div>
  );
}