import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  Link,
  ScrollRestoration,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import * as yup from "yup";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";
import { AuthContext } from "../context/AuthContext";
import { clearDataProfile } from "../redux/reducers/profile";

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
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const { setAccessToken } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        email: searchParams.get("email"),
        token: searchParams.get("token"),
        newPassword: data.password,
      }).toString();

      const res = await fetch(
        import.meta.env.VITE_BASE_URL + "/auth/reset-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        }
      );

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Failed to reset password");
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setAlertStatus({
        type: "success",
        message: "Password has been reset successfully",
      });
      setTimeout(() => {
        setAccessToken("");
        dispatch(clearDataProfile());
        navigate("/auth/login");
      }, 1500);
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
          <div className="mb-8 text-center md:text-left">
            <img
              className="w-28 mx-auto md:mx-0"
              src="/img/logo-original.png"
              alt="Logo Daily Greens"
            />
          </div>

          {/* header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Set New Password
            </h1>
            <p className="text-sm text-gray-600">
              Your new password must be different from previously used passwords
            </p>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              {...register("password")}
              error={errors}
              id="password"
              type="password"
              label="New Password"
              placeholder="Enter your new password"
              disabled={isProcessing}
            />

            <Input
              {...register("confirmPassword")}
              error={errors}
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm your new password"
              disabled={isProcessing}
            />

            <Button
              disabled={isProcessing}
              type="submit"
              className="w-full bg-[#5a8120] hover:bg-[#4a6e18] text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
              {!isProcessing ? "Reset Password" : "Processing..."}
            </Button>
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

export default ResetPasswordPage;
