export default function Button({ children, onClick, type = "button", variant = "primary", fullWidth = false }) {
  const baseStyles = "px-4 py-2 rounded focus:outline-none transition";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    warning: "bg-yellow-400 text-white hover:bg-yellow-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {children}
    </button>
  );
}