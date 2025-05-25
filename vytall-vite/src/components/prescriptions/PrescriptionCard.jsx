// PrescriptionCard.jsx
export default function PrescriptionCard({ prescription }) {
  const { medication, dosage, frequency, issuedDate } = prescription;
  console.log('Prescription:', prescription);
  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition duration-200">
      <h3 className="text-lg font-semibold mb-2">{medication}</h3>
      <p className="text-gray-700">Dosage: {dosage}</p>
      <p className="text-gray-700">Frequency: {frequency}</p>
      <p className="text-gray-600 text-sm mt-1">
        Prescribed on:{' '}
        {prescription.issuedDate
          ? new Date(prescription.issuedDate).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
          : 'N/A'}
      </p>
    </div>
  );
}