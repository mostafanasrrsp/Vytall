import React, { useEffect, useState } from 'react';
import { fetchPrescriptions } from '../../../api/prescriptions';
import { useAuth } from '../../../login/AuthContext';
import Button from '../../ui/Button';

export default function ActivePrescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadActivePrescriptions();
  }, []);

  const loadActivePrescriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPrescriptions();
      
      // Filter for active prescriptions
      let activePrescriptions = data.filter(prescription => {
        const endDate = new Date(prescription.endDate);
        const today = new Date();
        return endDate >= today && prescription.status === "Active";
      });

      // Filter based on user role
      if (user?.role === "Physician") {
        activePrescriptions = activePrescriptions.filter(
          prescription => Number(prescription.physicianId) === Number(user.physicianId)
        );
      } else if (user?.role === "Patient") {
        activePrescriptions = activePrescriptions.filter(
          prescription => Number(prescription.patientId) === Number(user.patientId)
        );
      }

      // Sort by end date (soonest expiring first)
      activePrescriptions.sort((a, b) => 
        new Date(a.endDate) - new Date(b.endDate)
      );

      setPrescriptions(activePrescriptions);
    } catch (error) {
      console.error("Error fetching active prescriptions:", error);
      setError("Failed to load active prescriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return <div className="text-center py-4">Loading prescriptions...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Active Prescriptions</h2>
        <Button onClick={loadActivePrescriptions}>Refresh</Button>
      </div>

      {prescriptions.length === 0 ? (
        <p className="text-gray-500 text-center">No active prescriptions found.</p>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => {
            const daysRemaining = getDaysRemaining(prescription.endDate);
            const urgencyColor = 
              daysRemaining <= 3 ? "bg-red-50" :
              daysRemaining <= 7 ? "bg-yellow-50" :
              "bg-green-50";

            return (
              <div
                key={prescription.prescriptionId}
                className={`p-4 rounded-lg shadow ${urgencyColor} transition-colors duration-200`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">{prescription.medication}</p>
                    <p><strong>Patient:</strong> {prescription.patientName}</p>
                    <p><strong>Physician:</strong> Dr. {prescription.physicianName}</p>
                    <p><strong>Dosage:</strong> {prescription.dosage}</p>
                    <p><strong>Frequency:</strong> {prescription.frequency}</p>
                    <p><strong>End Date:</strong> {new Date(prescription.endDate).toLocaleDateString()}</p>
                    {prescription.instructions && (
                      <p className="mt-2">
                        <strong>Instructions:</strong><br />
                        <span className="text-gray-700">{prescription.instructions}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${daysRemaining <= 3 ? 'bg-red-200 text-red-800' :
                        daysRemaining <= 7 ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'}`}
                    >
                      {daysRemaining} days remaining
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 