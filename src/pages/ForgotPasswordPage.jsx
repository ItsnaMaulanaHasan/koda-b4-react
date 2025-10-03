import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const ForgotPasswordFormSchema = yup.object({
  email: yup.string().required("Email is required").email("Invalid email format"),
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
          navigate("/login");
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
    <main>
      <Alert type={alertStatus.type} message={alertStatus.message} onClose={() => setAlertStatus({ type: "", message: "" })} />
      <div className="flex w-full min-h-screen">
        <div className="w-1/4">
          <img className="h-full w-full object-cover" src="/public/img/img-forgot-password.png" alt="Image Login" />
        </div>
        <div className="flex gap-5 flex-col px-40 py-20 flex-1">
          <div>
            <img src="/public/icon/icon-header.svg" alt="Icon Header" />
          </div>
          <h1 className="font-semibold text-[#8E6447] text-xl">Fill out the form correctly</h1>
          <p className="text-[#4F5665]">We will send new password to your email</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <Input {...register("email")} error={errors} id="email" type="email" label="Email" placeholder="Enter Your Email" />
              <Button type="submit" className="bg-[#FF8906]">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
