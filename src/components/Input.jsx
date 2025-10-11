import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Input component with label, icon, and password visibility toggle
 * @param {Object} props - Component props
 * @param {string} props.type - HTML input type (text, email, password, etc.)
 * @param {string} props.id - Input field identifier (fullName, email, address, password, confirmPassword, search)
 * @param {string} props.label - Label text to display above input
 * @param {string} props.placeholder - Placeholder text for input field
 * @param {Object} [props.error={}] - Error object containing validation messages
 * @param {Object} props.register - React Hook Form register object for form validation
 * @returns {JSX.Element} Input component with icon and error handling
 */
function Input({
  type,
  id,
  label,
  placeholder,
  error = {},
  passwordInProfile = false,
  ...register
}) {
  const [showPassword, setShowPassword] = useState(false);
  let isPassword = false;
  let icon = "";
  switch (id) {
    case "fullName":
      icon = "/icon/icon-profile.svg";
      break;
    case "email":
      icon = "/icon/icon-mail.svg";
      break;
    case "address":
      icon = "/icon/icon-location.svg";
      break;
    case "phone":
      icon = "/icon/icon-phone.svg";
      break;
    case "password":
    case "confirmPassword":
      icon = "/icon/icon-password.svg";
      isPassword = true;
      break;
    default:
      icon = "";
      break;
  }

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      {passwordInProfile ? (
        <div className="flex items-center justify-between">
          <label
            className={`font-bold text-sm sm:text-base ${
              id !== "search" ? "text-[#0B132A]" : "text-white"
            }`}
            htmlFor={id}>
            {label}
          </label>
          <Link
            to="/auth/forgot-password"
            className="text-[#FF8906] text-xs sm:text-sm">
            Set New Password
          </Link>
        </div>
      ) : (
        <label
          className={`font-bold text-sm sm:text-base ${
            id !== "search" ? "text-[#0B132A]" : "text-white"
          }`}
          htmlFor={id}>
          {label}
        </label>
      )}
      {!isPassword ? (
        <div>
          <div className="flex border rounded-md py-2.5 px-3 sm:py-3 sm:px-4 border-[#DEDEDE] w-full gap-3 sm:gap-4">
            {icon && (
              <img className="w-4 h-4 sm:w-5 sm:h-5" src={icon} alt={id} />
            )}
            <input
              {...register}
              id={id}
              type={type}
              placeholder={placeholder}
              className="w-full text-xs focus:outline-none sm:text-sm placeholder:text-xs sm:placeholder:text-sm"
            />
          </div>
          {error[id] && (
            <p className="mt-1 text-xs text-red-500 sm:text-sm">
              {error[id].message}
            </p>
          )}
        </div>
      ) : (
        <div>
          <div className="flex border rounded-md py-2.5 px-3 sm:py-3 sm:px-4 border-[#DEDEDE] w-full gap-3 sm:gap-4">
            <img className="w-4 h-4 sm:w-5 sm:h-5" src={icon} alt={id} />
            <input
              {...register}
              id={id}
              type={!showPassword ? type : "text"}
              placeholder={placeholder}
              className="w-full text-xs focus:outline-none sm:text-sm placeholder:text-xs sm:placeholder:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5">
              {!showPassword ? (
                <img
                  className="w-full h-full"
                  src="/icon/icon-eye.svg"
                  alt="Icon Eye Open"
                />
              ) : (
                <img
                  className="w-full h-full"
                  src="/icon/icon-eye-off.svg"
                  alt="Icon Eye Close"
                />
              )}
            </button>
          </div>
          {error[id] && (
            <p className="mt-1 text-xs text-red-500 sm:text-sm">
              {error[id].message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Input;
