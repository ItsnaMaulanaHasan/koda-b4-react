import { yupResolver } from "@hookform/resolvers/yup";
import bcrypt from "bcryptjs";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";
import { AuthContext } from "../context/AuthContext";

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
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });
  const [isLogginIn, setIsLogginIn] = useState(false);
  const navigate = useNavigate();
  const { setUserLogin } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginFormSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLogginIn(true);
      const { email, password } = data;

      // set admin credential
      const adminCredentials = {
        email: "admin@hifi.com",
        password: "admin123",
        fullName: "Administrator",
        role: "admin",
        id: 0,
      };

      // cek login admin
      if (
        email === adminCredentials.email &&
        password === adminCredentials.password
      ) {
        const adminDataToStore = {
          id: adminCredentials.id,
          email: adminCredentials.email,
          fullName: adminCredentials.fullName,
          role: adminCredentials.role,
        };

        setAlertStatus({
          type: "success",
          message: "Login successful as Admin!",
        });

        setTimeout(() => {
          setUserLogin(adminDataToStore);
          navigate("/admin/dashboard");
          setIsLogginIn(false);
        }, 1500);
        return;
      }

      const usersData = JSON.parse(localStorage.getItem("users") || "[]");
      const user = usersData.find((user) => user.email === email);

      // cek email
      if (!user) {
        setAlertStatus({
          type: "error",
          message: "Incorrect email or password",
        });
        setIsLogginIn(false);
        return;
      }

      // cek password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const userDataToStore = {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          joinDate: user.joinDate,
        };

        setAlertStatus({ type: "success", message: "Login successful!" });

        setTimeout(() => {
          setUserLogin(userDataToStore);
          navigate("/");
          setIsLogginIn(false);
        }, 1500);
      } else {
        setAlertStatus({
          type: "error",
          message: "Incorrect email or password",
        });
        setIsLogginIn(false);
      }
    } catch (error) {
      setAlertStatus({
        type: "error",
        message: `An error occurred while process the data. Please try again: ${error}`,
      });
      setIsLogginIn(false);
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
          src="/img/img-login.png"
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
        <h1 className="font-semibold text-[#8E6447] text-xl">Login</h1>
        <p className="text-[#4F5665]">Fill out the form correctly</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <Input
              {...register("email")}
              error={errors}
              id="email"
              type="email"
              label="Email"
              placeholder="Enter Your Email"
              disabled={isLogginIn}
            />
            <Input
              {...register("password")}
              error={errors}
              id="password"
              type="password"
              label="Password"
              placeholder="Enter Your Password"
              disabled={isLogginIn}
            />
            <Link
              className="text-sm text-[#FF8906] w-max self-end"
              to="/forgot-password">
              Forgot Password?
            </Link>
            <Button
              disabled={isLogginIn}
              type="submit"
              className="bg-[#FF8906] disabled:opacity-50 disabled:cursor-not-allowed">
              {!isLogginIn ? "Login" : "Logging In..."}
            </Button>
          </div>
        </form>
        <div className="text-center">
          Not Have An Account?{" "}
          <Link className="text-[#FF8906]" to="/auth/register">
            Register
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
            <span className="hidden sm:inline">Goolge</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
