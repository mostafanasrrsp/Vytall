// PrescriptionCard.jsx
export default function PrescriptionCard({ prescription }) {
  const { medication, dosage, frequency, prescribedDate } = prescription;

  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition duration-200">
      <h3 className="text-lg font-semibold mb-2">{medication}</h3>
      <p className="text-gray-700">Dosage: {dosage}</p>
      <p className="text-gray-700">Frequency: {frequency}</p>
      <p className="text-gray-600 text-sm mt-1">
        Prescribed on: {new Date(prescription.issuedDate).toLocaleDateString()}
      </p>
    </div>
  );
}