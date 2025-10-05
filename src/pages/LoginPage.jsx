import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { Link } from "react-router-dom";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";

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
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginFormSchema),
  });

  const onSubmit = (data) => {
    try {
      const { email, password } = data;
      const usersData = JSON.parse(localStorage.getItem("users") || "[]");

      const isValidLogin = usersData.find(
        (data) => data.email === email && data.password === password
      );

      if (isValidLogin) {
        setAlertStatus({ type: "success", message: "Login successful!" });
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setAlertStatus({
          type: "error",
          message: "Incorrect email or password",
        });
      }
    } catch (error) {
      setAlertStatus({
        type: "error",
        message: `An error occurred while process the data. Please try again: ${error}`,
      });
    }
  };
  return (
    <main>
      <Alert
        type={alertStatus.type}
        message={alertStatus.message}
        onClose={() => setAlertStatus({ type: "", message: "" })}
      />
      <div className="flex w-full min-h-screen">
        <div className="w-1/4">
          <img
            className="h-full w-full object-cover"
            src="/img/img-login.png"
            alt="Image Login"
          />
        </div>
        <div className="flex gap-5 flex-col px-40 py-20 flex-1">
          <div>
            <img src="/icon/logo-original.svg" alt="Icon Header" />
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
              />
              <Input
                {...register("password")}
                error={errors}
                id="password"
                type="password"
                label="Password"
                placeholder="Enter Your Password"
              />
              <Link
                className="text-sm text-[#FF8906] text-end"
                to="/forgot-password"
              >
                Forgot Password?
              </Link>
              <Button type="submit" className="bg-[#FF8906]">
                Login
              </Button>
            </div>
          </form>
          <div className="text-center">
            Not Have An Account?{" "}
            <Link className="text-[#FF8906]" to="/register">
              Register
            </Link>
          </div>
          <div className="flex w-full items-center">
            <div className="h-[1px] bg-[#DEDEDE] w-[40%]"></div>
            <div className="w-[20%] text-center text-[#DEDEDE]">or</div>
            <div className="h-[1px] bg-[#DEDEDE] w-[40%]"></div>
          </div>
          <div className="flex gap-10">
            <Button className="flex items-center justify-center gap-3 py-4 flex-1 shadow-lg">
              <img src="/img/img-facebook.png" alt="Logo Facebook" />
              Facebook
            </Button>
            <Button className="flex items-center justify-center gap-3 py-4 flex-1 shadow-lg">
              <img src="/img/img-google.png" alt="Logo Google" />
              Goolge
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
