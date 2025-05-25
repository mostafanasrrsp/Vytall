// DiagnosisCard.jsx
export default function DiagnosisCard({ diagnosis }) {
  const { patientName, details, diagnosedOn } = diagnosis;

  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition duration-200">
      <h3 className="text-lg font-semibold mb-2">{patientName}</h3>
      <p className="text-gray-700">{details}</p>
      <p className="text-gray-600 text-sm">Diagnosed on: {new Date(diagnosedOn).toLocaleDateString()}</p>
    </div>
  );
}