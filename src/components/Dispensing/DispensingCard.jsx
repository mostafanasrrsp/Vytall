// DispensingCard.jsx
export default function DispensingCard({ dispensing }) {
    const { medication, quantity, pharmacistName, dispensedDate } = dispensing;
  
    return (
      <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition duration-200">
        <h3 className="text-lg font-semibold mb-2">{medication}</h3>
        <p className="text-gray-700">Quantity: {quantity}</p>
        <p className="text-gray-700">Pharmacist: {pharmacistName}</p>
        <p className="text-gray-600 text-sm mt-1">
          Dispensed on: {new Date(dispensedDate).toLocaleDateString()}
        </p>
      </div>
    );
  }