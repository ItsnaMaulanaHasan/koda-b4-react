import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, ScrollRestoration, useNavigate } from "react-router-dom";
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
    setIsRegister(true);
    try {
      const body = new URLSearchParams({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      }).toString();

      const res = await fetch(
        import.meta.env.VITE_BASE_URL + "/auth/register",
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
        throw new Error(result.message || "Registration failed");
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setAlertStatus({ type: "success", message: "Registration successful" });

      setTimeout(() => {
        navigate("/auth/login");
      }, 1500);
    } catch (error) {
      let errorMessage = "Registration failed";

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
      setIsRegister(false);
    }
  };
  return (
    <div className="relative flex w-full h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-amber-50">
      <ScrollRestoration />
      <Alert
        type={alertStatus.type}
        message={alertStatus.message}
        onClose={() => setAlertStatus({ type: "", message: "" })}
      />

      {/* left side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-amber-900/20 z-10"></div>
        <img
          className="object-cover w-full h-full"
          src="/img/img-register.png"
          alt="Image Register"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 text-white">
          <div className="backdrop-blur-sm bg-white/10 p-8 rounded-2xl border border-white/20">
            <h2 className="text-3xl font-bold mb-3">Ready to Get Fresh?</h2>
            <p className="text-base opacity-90">
              Sign up now and enjoy fresh, healthy products delivered straight
              to your doorstep.
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <div className="flex flex-1 items-center justify-center px-6 sm:px-12 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md py-8 lg:mt-20">
          {/* logo */}
          <div className="text-center md:text-left">
            <img
              className="w-28 mx-auto md:mx-0"
              src="/img/logo-original.png"
              alt="Logo Daily Greens"
            />
          </div>

          {/* header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Sign Up</h1>
            <p className="text-sm text-gray-600">Fill out the form correctly</p>
          </div>
          {/* form register */}
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
                className="w-full bg-[#5a8120] hover:bg-[#4a6e18] text-white font-semibold py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                {isRegister ? "Get started in seconds..." : "Sign Up"}
              </Button>
            </div>
          </form>

          <div className="mt-5 text-center text-sm">
            <span className="text-gray-600">Have An Account?</span>
            <Link
              className="text-[#5a8120] font-semibold hover:text-[#4a6e18] transition-colors"
              to="/auth/login">
              Sign In
            </Link>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="px-4 text-xs text-gray-500">Or continue with</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* oauth fb and google */}
          <div className="grid grid-cols-2 gap-3">
            <Button className="flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-gray-200 hover:border-[#5a8120] hover:bg-green-50 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md">
              <img
                src="/img/img-facebook.png"
                alt="Logo Facebook"
                className="w-4 h-4"
              />
              <span className="font-medium text-sm text-gray-700">
                Facebook
              </span>
            </Button>
            <Button className="flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-gray-200 hover:border-[#5a8120] hover:bg-green-50 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md">
              <img
                src="/img/img-google.png"
                alt="Logo Google"
                className="w-4 h-4"
              />
              <span className="font-medium text-sm text-gray-700">Google</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
