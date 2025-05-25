import React, { useEffect, useState } from 'react';
import { fetchDiagnoses } from '../../../api/diagnoses';
import { useAuth } from '../../../login/AuthContext';
import Button from '../../ui/Button';

export default function PendingDiagnoses() {
  const { user } = useAuth();
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPendingDiagnoses();
  }, []);

  const loadPendingDiagnoses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDiagnoses();
      
      // Filter for pending diagnoses
      let pendingDiagnoses = data.filter(diagnosis => 
        diagnosis.status === "Pending" || diagnosis.status === "In Review"
      );

      // Filter based on user role
      if (user?.role === "Physician") {
        pendingDiagnoses = pendingDiagnoses.filter(
          diagnosis => Number(diagnosis.physicianId) === Number(user.physicianId)
        );
      } else if (user?.role === "Patient") {
        pendingDiagnoses = pendingDiagnoses.filter(
          diagnosis => Number(diagnosis.patientId) === Number(user.patientId)
        );
      }

      // Sort by creation date (newest first)
      pendingDiagnoses.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setDiagnoses(pendingDiagnoses);
    } catch (error) {
      console.error("Error fetching pending diagnoses:", error);
      setError("Failed to load pending diagnoses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading diagnoses...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pending Diagnoses</h2>
        <Button onClick={loadPendingDiagnoses}>Refresh</Button>
      </div>

      {diagnoses.length === 0 ? (
        <p className="text-gray-500 text-center">No pending diagnoses found.</p>
      ) : (
        <div className="space-y-4">
          {diagnoses.map((diagnosis) => (
            <div
              key={diagnosis.diagnosisId}
              className="p-4 rounded-lg shadow bg-yellow-50 transition-colors duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{diagnosis.condition}</p>
                  <p><strong>Patient:</strong> {diagnosis.patientName}</p>
                  <p><strong>Physician:</strong> Dr. {diagnosis.physicianName}</p>
                  <p><strong>Status:</strong> {diagnosis.status}</p>
                  <p><strong>Created:</strong> {new Date(diagnosis.createdAt).toLocaleDateString()}</p>
                  {diagnosis.notes && (
                    <p className="mt-2">
                      <strong>Notes:</strong><br />
                      <span className="text-gray-700">{diagnosis.notes}</span>
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-yellow-200 text-yellow-800 text-sm font-medium">
                    {diagnosis.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 