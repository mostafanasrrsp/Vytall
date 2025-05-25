import { useEffect, useState } from 'react';
import { fetchPrescriptionReminders } from '../../api/prescriptions';
import { useAuth } from '../../login/AuthContext';
import Button from '../ui/Button';

export default function Prescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'

  useEffect(() => {
    if (!user?.patientId) return;

    fetchPrescriptionReminders(user.patientId)
      .then((data) => setPrescriptions(data))
      .catch((err) => setError(err.message || "Failed to load prescriptions."))
      .finally(() => setLoading(false));
  }, [user?.patientId]);

  const getPrescriptionStatus = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const daysUntilExpiry = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'expired', label: 'Expired', color: 'bg-red-100 text-red-800' };
    if (daysUntilExpiry <= 7) return { status: 'expiring', label: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'active', label: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const filterPrescriptions = (prescriptions) => {
    if (activeTab === 'active') {
      return prescriptions.filter(p => {
        const { status } = getPrescriptionStatus(p.expirationDate);
        return status !== 'expired';
      });
    }
    return prescriptions.filter(p => {
      const { status } = getPrescriptionStatus(p.expirationDate);
      return status === 'expired';
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-6 bg-red-50 rounded-lg text-red-600">
      <h3 className="font-semibold mb-2">Error Loading Prescriptions</h3>
      <p>{error}</p>
    </div>
  );

  const filteredPrescriptions = filterPrescriptions(prescriptions);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Prescriptions</h1>
        <p className="text-gray-600">View and manage your current and past prescriptions</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-4 px-4 font-medium ${
            activeTab === 'active'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Active Prescriptions
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-4 px-4 font-medium ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Prescription History
        </button>
      </div>

      {filteredPrescriptions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            {activeTab === 'active' 
              ? "You don't have any active prescriptions."
              : "You don't have any expired prescriptions."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPrescriptions.map((prescription) => {
            const { label, color } = getPrescriptionStatus(prescription.expirationDate);
            const expDate = new Date(prescription.expirationDate).toLocaleDateString();
            
            return (
              <div key={prescription.prescriptionId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Dr. {prescription.physicianName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                          {label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Prescribed on {new Date(prescription.issuedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {prescription.medications?.map((medication, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Medication</p>
                            <p className="mt-1">{medication.medicationDetails}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Dosage</p>
                            <p className="mt-1">{medication.dosage}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Frequency</p>
                            <p className="mt-1">{medication.frequency}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {prescription.notes && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">{prescription.notes}</p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                    <p>Expires: {expDate}</p>
                    {activeTab === 'active' && (
                      <Button variant="primary" size="sm">
                        Request Refill
                      </Button>
                    )}
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