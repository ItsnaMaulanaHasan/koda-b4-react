import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, ScrollRestoration } from "react-router-dom";
import * as yup from "yup";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";
import { AuthContext } from "../context/AuthContext";
import { setAmountCarts } from "../redux/reducers/cart";
import { setDataProfile } from "../redux/reducers/profile";

const LoginFormSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

function LoginPage() {
  // state for alert
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });
  // state for disable button
  const [isLogginIn, setIsLogginIn] = useState(false);
  // dispatch for set data redux profile
  const dispatch = useDispatch();

  // get setAccessToken from context for set access token
  const { setAccessToken } = useContext(AuthContext);

  // initiate useform
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginFormSchema),
  });

  // handle submit login
  const onSubmit = async (data) => {
    setIsLogginIn(true);
    try {
      // set body for request login
      const body = new URLSearchParams({
        email: data.email,
        password: data.password,
      }).toString();

      // request login
      const resLogin = await fetch(
        import.meta.env.VITE_BASE_URL + "/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        }
      );

      if (!resLogin.ok) {
        const resultLogin = await resLogin.json();
        throw new Error(resultLogin.message || "Login failed");
      }

      const resultLogin = await resLogin.json();

      if (!resultLogin.success) {
        throw new Error(resultLogin.message);
      }

      const token = resultLogin.data.token;

      // request get data profile
      const resProfile = await fetch(
        import.meta.env.VITE_BASE_URL + "/profiles",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resProfile.ok) {
        const resultProfile = await resProfile.json();
        throw new Error(resultProfile.message || "Login failed");
      }

      const resultProfile = await resProfile.json();

      if (!resultProfile.success) {
        throw new Error(resultProfile.message);
      }

      const resCarts = await fetch(import.meta.env.VITE_BASE_URL + "/carts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resultCarts = await resCarts.json();

      const carts = resultCarts?.data || [];
      dispatch(setAmountCarts(carts.length));

      setAlertStatus({ type: "success", message: "Login successful!" });
      setTimeout(() => {
        dispatch(setDataProfile(resultProfile.data));
        setAccessToken(token);
      }, 1500);
    } catch (error) {
      let errorMessage = "Login failed";
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
      setIsLogginIn(false);
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
          src="/img/img-login.png"
          alt="Image Login"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 text-white">
          <div className="backdrop-blur-sm bg-white/10 p-8 rounded-2xl border border-white/20">
            <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>
            <p className="text-base opacity-90">
              Fresh and healthy products delivered to your doorstep
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <div className="flex flex-1 items-center justify-center px-6 sm:px-12 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* logo */}
          <div className="mb-6 text-center md:text-left">
            <img
              className="w-28 mx-auto md:mx-0"
              src="/img/logo-original.png"
              alt="Logo Daily Greens"
            />
          </div>

          {/* header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Sign In</h1>
            <p className="text-sm text-gray-600">
              Welcome back! Please enter your details
            </p>
          </div>

          {/* form login */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register("email")}
              error={errors}
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              disabled={isLogginIn}
            />

            <Input
              {...register("password")}
              error={errors}
              id="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              disabled={isLogginIn}
            />

            <div className="flex items-center justify-end">
              <Link
                className="text-sm font-medium text-[#5a8120] hover:text-[#4a6e18] transition-colors"
                to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            <Button
              disabled={isLogginIn}
              type="submit"
              className="w-full bg-[#5a8120] hover:bg-[#4a6e18] text-white font-semibold py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
              {!isLogginIn ? "Sign In" : "Signing In..."}
            </Button>
          </form>

          <div className="mt-5 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              className="text-[#5a8120] font-semibold hover:text-[#4a6e18] transition-colors"
              to="/auth/register">
              Sign Up
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

export default LoginPage;
