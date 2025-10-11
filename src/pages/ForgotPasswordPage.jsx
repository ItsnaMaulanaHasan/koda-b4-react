import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";

const ForgotPasswordFormSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
});

function ForgotPasswordPage() {
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
          <img src="/icon/logo-original.svg" alt="Icon Header" />
        </div>
        <h1 className="font-semibold text-[#8E6447] text-xl">
          Fill out the form correctly
        </h1>
        <p className="text-[#4F5665]">
          We will send new password to your email
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <Input
              {...register("email")}
              error={errors}
              id="email"
              type="email"
              label="Email"
              placeholder="Enter Your Email"
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

export default ForgotPasswordPage;
