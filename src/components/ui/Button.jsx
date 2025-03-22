export default function Button({ children, onClick, type = "button", variant = "primary", fullWidth = false }) {
  const baseStyles = "px-4 py-2 rounded-full font-semibold focus:outline-none transition shadow-sm";
  const variants = {
    primary: "bg-[#609bd8] text-white hover:bg-[#4e8ac7]", // Lighter hover
    secondary: "bg-slate-500 text-white hover:bg-slate-600",
    warning: "bg-[#f7a541] text-white hover:bg-[#f78941]", // Subtle orange
    danger: "bg-[#d9534f] text-white hover:bg-[#c9302c]", // Deeper, more consistent red
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