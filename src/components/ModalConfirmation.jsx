import { X } from "lucide-react";

function ModalConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmClassName = "bg-[#FF8906] text-white hover:bg-[#e67a05]",
  type = "warning", // warning, danger, info
}) {
  if (!isOpen) return null;

  const iconStyles = {
    warning: "text-yellow-500",
    danger: "text-red-500",
    info: "text-blue-500",
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              type === "warning"
                ? "bg-yellow-100"
                : type === "danger"
                ? "bg-red-100"
                : "bg-blue-100"
            }`}
          >
            <span className={`text-3xl ${iconStyles[type]}`}>
              {type === "warning" ? "⚠️" : type === "danger" ? "🗑️" : "ℹ️"}
            </span>
          </div>
        </div>
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {title}
        </h2>
        {/* Message */}
        <p className="text-center text-gray-600 mb-6">{message}</p>
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${confirmClassName}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmation;
