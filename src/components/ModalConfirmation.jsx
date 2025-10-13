import { X } from "lucide-react";
import Button from "../components/Button";

/**
 * ModalConfirmation component for displaying confirmation dialogs
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback function when modal is closed
 * @param {Function} props.onConfirm - Callback function when user confirms action
 * @param {string} [props.title="Confirmation"] - Modal title text
 * @param {string} [props.message="Are you sure you want to proceed?"] - Confirmation message
 * @param {string} [props.confirmText="Confirm"] - Text for confirm button
 * @param {string} [props.cancelText="Cancel"] - Text for cancel button
 * @param {string} [props.confirmClassName="bg-[#FF8906] text-white hover:bg-[#e67a05]"] - Custom CSS classes for confirm button
 * @param {'warning'|'danger'|'info'} [props.type="warning"] - Type of modal determining icon and styling
 * @returns {JSX.Element|null} ModalConfirmation component or null if not open
 */
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
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
          <X size={20} />
        </button>
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex align-middle items-center justify-center ${
              type === "warning"
                ? "bg-yellow-100"
                : type === "danger"
                ? "bg-red-100"
                : "bg-blue-100"
            }`}>
            <span className={`text-3xl ${iconStyles[type]}`}>
              {type === "warning" ? "⚠️" : type === "danger" ? "💀" : "ℹ️"}
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
          <Button
            onClick={onClose}
            className="flex-1 py-3 px-4 border-2 border-gray-300 font-medium hover:bg-gray-50 transition">
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 font-medium transition ${confirmClassName}`}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmation;
