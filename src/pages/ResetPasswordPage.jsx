import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";

const ForgotPasswordFormSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Password confirmation is required")
    .oneOf([yup.ref("password")], "Password does not match"),
});

function ResetPasswordPage() {
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ForgotPasswordFormSchema),
  });

  const onSubmit = (data) => {
    try {
      const { email } = data;
      const usersData = JSON.parse(localStorage.getItem("users") || "[]");

      const isValidEmail = usersData.find((data) => data.email === email);

      if (isValidEmail) {
        setAlertStatus({ type: "success", message: "Email sent successfully" });
        setTimeout(() => {
          navigate("/auth/login");
        }, 1500);
      } else {
        setAlertStatus({ type: "error", message: "Email not registered" });
      }
    } catch (error) {
      setAlertStatus({
        type: "error",
        message: `An error occurred while process the data. Please try again: ${error}`,
      });
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
          src="/img/img-forgot-password.png"
          alt="Image Login"
        />
      </div>
      <div className="flex flex-col flex-1 gap-5 px-8 py-20 sm:px-12 md:px-16 lg:px-40">
        <div>
          <img
            className="w-30"
            src="/img/logo-original.png"
            alt="Logo Daily Greens"
          />
        </div>
        <h1 className="font-semibold text-[#8E6447] text-xl">
          Fill out the form correctly
        </h1>
        <p className="text-[#4F5665]">Set your new password</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <Input
              {...register("password")}
              error={errors}
              id="password"
              type="password"
              label="New Password"
              placeholder="Enter Your New Password"
            />
            <Input
              {...register("confirmPassword")}
              error={errors}
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm New Password"
            />
            <Button type="submit" className="bg-[#FF8906]">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
