import { useState } from "react";

function Input({ type, id, label, placeholder, error, ...register }) {
  const [showPassword, setShowPassword] = useState(false);
  let isPassword = false;
  let icon = "";
  switch (id) {
    case "fullName":
      icon = "/public/icon/icon-profile.svg";
      break;
    case "email":
      icon = "/public/icon/icon-mail.svg";
      break;
    case "password":
    case "confirmPassword":
      icon = "/public/icon/icon-password.svg";
      isPassword = true;
      break;
    default:
      icon = "/public/icon/icon-profile.svg";
      break;
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="font-bold text-[#0B132A]" htmlFor={id}>
        {label}
      </label>
      {!isPassword ? (
        <div>
          <div className="flex border rounded-md py-3 px-4 border-[#DEDEDE] w-full gap-4">
            <img src={icon} alt={id} />
            <input {...register} id={id} type={type} placeholder={placeholder} className="focus:outline-none w-full text-sm" />
          </div>
          {error[id] && <p className="text-red-500 text-sm mt-1">{error[id].message}</p>}
        </div>
      ) : (
        <div>
          <div className="flex border rounded-md py-3 px-4 border-[#DEDEDE] w-full gap-4">
            <img src={icon} alt={id} />
            <input {...register} id={id} type={!showPassword ? type : "text"} placeholder={placeholder} className="focus:outline-none w-full text-sm" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="h-4 w-4">
              {!showPassword ? <img src="/public/icon/icon-eye.svg" alt="Icon Eye Open" /> : <img src="/public/icon/icon-eye-off.svg" alt="Icon Eye Close" />}
            </button>
          </div>
          {error[id] && <p className="text-red-500 text-sm mt-1">{error[id].message}</p>}
        </div>
      )}
    </div>
  );
}

export default Input;
