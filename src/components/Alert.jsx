import { useEffect } from "react";
import { X } from "lucide-react";

function Alert({ type, message, onClose, duration = 3000, onClick }) {
  useEffect(() => {
    if (type && message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [type, message, onClose, duration]);

  if (!type || !message) return null;

  const alertStyles = {
    success: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-100 border-red-500 text-red-700",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
    info: "bg-blue-100 border-blue-500 text-blue-700",
  };

  return (
    <div
      onClick={onClick}
      className="fixed top-25 right-4 animate-slide-in z-200"
    >
      <div
        className={`border-l-4 p-4 rounded shadow-lg min-w-[300px] ${
          alertStyles[type] || alertStyles.info
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">{message}</p>
          <button
            onClick={onClose}
            className="text-xl leading-none hover:opacity-70"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Alert;
