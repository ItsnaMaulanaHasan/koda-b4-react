import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ForgotPasswordFormSchema),
  });

  const onSubmit = async (data) => {
    setIsProcessing(true);
    try {
      const body = new URLSearchParams({
        email: data.email,
      }).toString();

      const res = await fetch(
        import.meta.env.VITE_BASE_URL + "/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        }
      );

      if (!res.ok) {
        const result = await res.json();
        throw new Error(
          result.message || "Password reset email failed to send"
        );
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setAlertStatus({
        type: "success",
        message: "Password reset link sent to email. Please Check your email",
      });
    } catch (error) {
      let errorMessage = "An error occurred while processing data";
      if (error.message) {
        errorMessage = error.message;
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection";
      }
      setAlertStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsProcessing(false);
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
              disabled={isProcessing}
            />
            <Button
              disabled={isProcessing}
              type="submit"
              className="bg-[#FF8906] disabled:opacity-50 disabled:cursor-not-allowed">
              {!isProcessing ? "Submit" : "Sending email..."}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
