import { Check } from "lucide-react";

const Checkbox = ({ checked, onChange, label, size = 20 }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          style={{
            width: size,
            height: size,
            borderColor: checked ? "#FF8906" : "#A0A3BD",
            backgroundColor: checked ? "#FF8906" : "transparent",
          }}
          className="border-1 rounded-md transition-all duration-200 flex items-center justify-center"
        >
          {checked && (
            <Check
              size={size * 0.7}
              className="text-[#0B132A]"
              strokeWidth={3}
            />
          )}
        </div>
      </div>
      {label && <span className="text-white">{label}</span>}
    </label>
  );
};

export default Checkbox;
