export default function Input({ label, type = 'text', value, onChange, required }) {
  return (
    <div className="w-full flex flex-col"> {/* full width with flex-col */}
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-2 border rounded"
      />
    </div>
  );
}