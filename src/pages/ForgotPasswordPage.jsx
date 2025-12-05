import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, ScrollRestoration } from "react-router-dom";
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
    <div className="flex w-full h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-amber-50">
      <ScrollRestoration />
      <Alert
        type={alertStatus.type}
        message={alertStatus.message}
        onClose={() => setAlertStatus({ type: "", message: "" })}
      />

      {/* form */}
      <div className="flex flex-1 items-center justify-center px-6 sm:px-12 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* logo */}
          <div className="text-center md:text-left">
            <img
              className="w-28 mx-auto md:mx-0"
              src="/img/logo-original.png"
              alt="Logo Daily Greens"
            />
          </div>

          {/* header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Fill out the form correctly
            </h1>
            <p className="text-sm text-gray-600">
              We will send new password to your email
            </p>
          </div>

          {/* form */}
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
                className="bg-[#5a8120] disabled:opacity-50 disabled:cursor-not-allowed">
                {!isProcessing ? "Submit" : "Sending email..."}
              </Button>
            </div>
          </form>

          {/* back to login */}
          <div className="mt-6 text-center">
            <Link
              className="text-sm text-gray-600 hover:text-[#5a8120] transition-colors inline-flex items-center gap-2"
              to="/auth/login">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
