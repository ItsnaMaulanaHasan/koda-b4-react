import { yupResolver } from "@hookform/resolvers/yup";
import bcrypt from "bcryptjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";

const RegisterFormSchema = yup.object({
  fullName: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Password confirmation is required")
    .oneOf([yup.ref("password")], "Password does not match"),
});

function RegisterPage() {
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RegisterFormSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsRegister(true);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const registerData = {
        id: Date.now(),
        fullName: data.fullName,
        email: data.email,
        role: "customer",
        password: hashedPassword,
        joinDate: new Date().toISOString(),
        phone: "",
        address: "",
        profileImage: "",
      };

      const existingData = JSON.parse(localStorage.getItem("users") || "[]");

      const emailExists = existingData.some(
        (user) => user.email === data.email
      );
      if (emailExists) {
        setAlertStatus({
          type: "error",
          message: "Email already registered!",
        });
        setIsRegister(false);
        return;
      }

      existingData.push(registerData);
      localStorage.setItem("users", JSON.stringify(existingData));

      setAlertStatus({ type: "success", message: "Registration successful!" });

      setTimeout(() => {
        navigate("/auth/login");
        setIsRegister(false);
      }, 1500);
    } catch (error) {
      setAlertStatus({
        type: "error",
        message: `An error occurred while saving the data. Please try again: ${error}`,
      });
      setIsRegister(false);
    }
  };
  return (
    <div className="flex w-full min-h-screen">
      <Alert
        type={alertStatus.type}
        message={alertStatus.message}
        onClose={() => setAlertStatus({ type: "", message: "" })}
      />
      <div className="hidden w-1/4 md:block">
        <img
          className="object-cover w-full h-full"
          src="/img/img-register.png"
          alt="Image Login"
        />
      </div>
      <div className="flex flex-col flex-1 gap-5 px-8 py-20 sm:px-12 md:px-16 lg:px-40">
        <div>
          <img src="/icon/logo-original.svg" alt="Icon Header" />
        </div>
        <h1 className="font-semibold text-[#8E6447] text-xl">Register</h1>
        <p className="text-[#4F5665]">Fill out the form correctly</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <Input
              {...register("fullName")}
              error={errors}
              id="fullName"
              type="text"
              label="Full Name"
              disabled={isRegister}
              placeholder="Enter Your Full Name"
            />
            <Input
              {...register("email")}
              error={errors}
              id="email"
              type="email"
              label="Email"
              disabled={isRegister}
              placeholder="Enter Your Email"
            />
            <Input
              {...register("password")}
              error={errors}
              id="password"
              type="password"
              label="Password"
              disabled={isRegister}
              placeholder="Enter Your Password"
            />
            <Input
              {...register("confirmPassword")}
              error={errors}
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              disabled={isRegister}
              placeholder="Enter Your Full Password Again"
            />
            <Button
              disabled={isRegister}
              type="submit"
              className="bg-[#FF8906]">
              {isRegister ? "Register..." : "Register"}
            </Button>
          </div>
        </form>
        <div className="text-center">
          Have An Account?{" "}
          <Link className="text-[#FF8906]" to="/auth/login">
            Login
          </Link>
        </div>
        <div className="flex items-center w-full">
          <div className="h-[1px] bg-[#DEDEDE] w-[40%]"></div>
          <div className="w-[20%] text-center text-[#DEDEDE]">or</div>
          <div className="h-[1px] bg-[#DEDEDE] w-[40%]"></div>
        </div>
        <div className="flex justify-center gap-10">
          <Button className="flex items-center justify-center gap-3 px-5 py-5 shadow-lg w-max sm:w-full sm:py-4 sm:px-0 sm:flex-1">
            <img src="/img/img-facebook.png" alt="Logo Facebook" />
            <span className="hidden sm:inline">Facebook</span>
          </Button>
          <Button className="flex items-center justify-center gap-3 px-5 py-5 shadow-lg w-max sm:w-full sm:py-4 sm:px-0 sm:flex-1">
            <img src="/img/img-google.png" alt="Logo Google" />
            <span className="hidden sm:inline">Google</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
