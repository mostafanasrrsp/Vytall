// src/components/pharmacists/Pharmacists.jsx
import { useEffect, useState } from 'react';
import PharmacistCard from './PharmacistCard';
import { fetchPharmacists } from '../../api/pharmacists';

export default function Pharmacists() {
  const [pharmacists, setPharmacists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPharmacists()
      .then(data => setPharmacists(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading pharmacists...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4 p-4">
      {pharmacists.length === 0 ? (
        <p className="text-gray-500">No pharmacists found.</p>
      ) : (
        pharmacists.map((pharmacist) => (
          <PharmacistCard key={pharmacist.id} pharmacist={pharmacist} />
        ))
      )}
    </div>
  );
}