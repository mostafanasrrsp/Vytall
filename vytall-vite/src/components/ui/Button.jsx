export default function Button({ children, onClick, type = "button", variant = "primary", fullWidth = false }) {
  const baseStyles = "px-4 py-2 rounded-full font-semibold focus:outline-none transition shadow-sm";
  const variants = {
    primary: "bg-[#6aa3db] text-white hover:bg-[#7fb5e7]", // Darker soft blue with proportionally darker hover
    secondary: "bg-slate-500 text-white hover:bg-slate-600",
    warning: "bg-[#f1c40f] text-white hover:bg-[#f4d03f]", // Softer yellow-orange
    success: "bg-[#27ae60] text-white hover:bg-[#2ecc71]", // Deeper green with lighter hover
    danger: "bg-[#e74c3c] text-white hover:bg-[#f16b5b]", // Vibrant red with lighter hover
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