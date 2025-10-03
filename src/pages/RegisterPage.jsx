import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { Link } from "react-router-dom";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const RegisterFormSchema = yup.object({
  fullName: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
  email: yup.string().required("Email harus diisi").email("Format email tidak valid"),
  password: yup.string().required("Password harus diisi").min(6, "Password minimal 6 karakter"),
  confirmPassword: yup
    .string()
    .required("Konfirmasi password harus diisi")
    .oneOf([yup.ref("password")], "Password tidak cocok"),
});

function RegisterPage() {
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RegisterFormSchema),
  });

  const onSubmit = (data) => {
    try {
      const registerData = {
        ...data,
        id: Date.now(),
      };

      const existingData = JSON.parse(localStorage.getItem("users") || "[]");
      existingData.push(registerData);
      localStorage.setItem("users", JSON.stringify(existingData));

      setAlertStatus({ type: "success", message: "Registration successful!" });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setAlertStatus({
        type: "error",
        message: `Terjadi kesalahan saat menyimpan data. Silakan coba lagi: ${error}`,
      });
    }
  };
  return (
    <main>
      <Alert type={alertStatus.type} message={alertStatus.message} onClose={() => setAlertStatus({ type: "", message: "" })} />
      <div className="flex w-full">
        <div className="w-1/4">
          <img className="h-full w-full object-cover" src="/public/img/img-register.png" alt="Image Login" />
        </div>
        <div className="flex gap-5 flex-col px-40 py-20 flex-1">
          <div>
            <img src="/public/icon/icon-header.svg" alt="Icon Header" />
          </div>
          <h1 className="font-semibold text-[#8E6447] text-xl">Register</h1>
          <p className="text-[#4F5665]">Fill out the form correctly</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <Input {...register("fullName")} error={errors} id="fullName" type="text" label="Full Name" placeholder="Enter Your Full Name" />
              <Input {...register("email")} error={errors} id="email" type="email" label="Email" placeholder="Enter Your Email" />
              <Input {...register("password")} error={errors} id="password" type="password" label="Password" placeholder="Enter Your Password" />
              <Input {...register("confirmPassword")} error={errors} id="confirmPassword" type="password" label="Confirm Password" placeholder="Enter Your Full Password Again" />
              <Button type="submit" className="bg-[#FF8906]">
                Register
              </Button>
            </div>
          </form>
          <div className="text-center">
            Have An Account?{" "}
            <Link className="text-[#FF8906]" to="/login">
              Login
            </Link>
          </div>
          <div className="flex w-full items-center">
            <div className="h-[1px] bg-[#DEDEDE] w-[40%]"></div>
            <div className="w-[20%] text-center text-[#DEDEDE]">or</div>
            <div className="h-[1px] bg-[#DEDEDE] w-[40%]"></div>
          </div>
          <div className="flex gap-10">
            <Button className="flex items-center justify-center gap-3 py-4 flex-1 shadow-lg">
              <img src="/public/img/img-facebook.png" alt="Logo Facebook" />
              Facebook
            </Button>
            <Button className="flex items-center justify-center gap-3 py-4 flex-1 shadow-lg">
              <img src="/public/img/img-google.png" alt="Logo Google" />
              Goolge
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
