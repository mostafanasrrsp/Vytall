export default function PharmacistCard({ pharmacist }) {
  const { name, contact } = pharmacist; // removed pharmacyName

  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition duration-200">
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-gray-600">{contact}</p>
    </div>
  );
}