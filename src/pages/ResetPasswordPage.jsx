import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
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
              disabled={isProcessing}
            />
            <Input
              {...register("confirmPassword")}
              error={errors}
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm New Password"
              disabled={isProcessing}
            />
            <Button
              disabled={isProcessing}
              type="submit"
              className="bg-[#FF8906] disabled:opacity-50 disabled:cursor-not-allowed">
              {!isProcessing ? "Submit" : "Reset email..."}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
