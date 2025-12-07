import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { AuthContext } from "../context/AuthContext";
import { DrawerAdminContext } from "../context/DrawerContext";
import Alert from "./Alert";
import Input from "./Input";
import ModalConfirmation from "./ModalConfirmation";

const AddUserSchema = yup.object({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  phone: yup
    .string()
    .required("Phone is required")
    .min(10, "Phone must be at least 10 digits"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Password confirmation is required")
    .oneOf([yup.ref("password")], "Password does not match"),
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
});

const UserForm = ({ user = null, mode = "add", onSuccess }) => {
  const { accessToken } = useContext(AuthContext);
  const { setShowDrawer } = useContext(DrawerAdminContext);
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userRole, setUserRole] = useState("customer");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(AddUserSchema),
  });

  useEffect(() => {
    if (mode === "edit" && user) {
      setValue("fullName", user.fullName);
      setValue("email", user.email);
      setValue("phone", user.phone);
      setValue("address", user.address);
      setUserRole(user.role || "customer");

      if (user.profilePhoto) {
        setImagePreview(user.profilePhoto);
      }
    } else {
      reset();
      setImageFile(null);
      setUserRole("customer");
    }
  }, [mode, user, setValue, reset]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // validasi type
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        setAlertStatus({
          type: "error",
          message: "Only JPG, JPEG, and PNG images are allowed",
        });
        return;
      }

      // validasi size
      if (file.size > 3 * 1024 * 1024) {
        setAlertStatus({
          type: "error",
          message: `Image ${file.name} is too large. Maximum size is 3MB`,
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("role", userRole);

      if (mode === "add") {
        if (imageFile) {
          formData.append("filePhoto", imageFile);
        }
      } else if (mode === "edit") {
        if (imageFile) {
          formData.append("filePhoto", imageFile);
        }
      }

      const url =
        mode === "edit"
          ? `${import.meta.env.VITE_BASE_URL}/admin/users/${user.id}`
          : `${import.meta.env.VITE_BASE_URL}/admin/users`;

      const method = mode === "edit" ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${mode} user`);
      }

      setAlertStatus({
        type: "success",
        message: `User ${
          mode === "edit" ? "updated" : "created"
        } successfully!`,
      });

      setTimeout(() => {
        setShowDrawer(false);
        if (onSuccess) {
          onSuccess();
        }
      }, 1000);

      reset();
      setImageFile(null);
      setImagePreview(null);
      setUserRole("customer");
    } catch (err) {
      setAlertStatus({
        type: "error",
        message: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (userId) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/users/${userId}/reset-password`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to reset password");
      }

      setAlertStatus({
        type: "success",
        message: "Password reset successfully! New password: Password@123",
      });

      setShowModal(false);
    } catch (err) {
      setAlertStatus({
        type: "error",
        message: err.message,
      });
      setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Alert
        type={alertStatus.type}
        message={alertStatus.message}
        onClose={() => setAlertStatus({ type: "", message: "" })}
      />
      <ModalConfirmation
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => resetPassword(user.id)}
        title="Confirm Reset Password"
        message="Are you sure you want to reset password?"
        confirmText="Reset"
        cancelText="Cancel"
        type="warning"
      />
      <div className="flex flex-col flex-1 gap-5 p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {mode === "edit" ? "Edit User" : "Insert User"}
          </h1>
          <button
            onClick={() => setShowDrawer(false)}
            className="flex items-center justify-center text-red-500 transition border-2 border-red-500 rounded-full w-7 h-7 hover:bg-red-50">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Image User */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Photo Profile{" "}
              {mode === "add" && <span className="text-red-500">*</span>}
              <span className="text-xs text-gray-500"> (Max 1 image, 3MB)</span>
            </label>

            {/* preview image */}
            {imagePreview && (
              <div className="mb-3">
                <p className="mb-2 text-xs text-gray-600">
                  {mode === "edit" ? "New Image to Upload:" : "Preview Image:"}{" "}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover w-full h-20 rounded-lg"
                      onError={(e) => {
                        e.target.src = "/img/empty-image-placeholder.webp";
                      }}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute flex items-center justify-center w-5 h-5 text-xs text-white transition bg-red-500 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )}

            {mode === "add" && !imagePreview && (
              <div className="flex items-center justify-center w-16 h-16 mb-3 bg-gray-100 rounded-lg">
                <img src="/icon/empty-preview.svg" alt="Empty preview" />
              </div>
            )}

            {/* Upload Button */}
            <>
              <input
                type="file"
                id="image-upload"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="px-4 py-2 rounded-lg cursor-pointer transition text-sm font-medium inline-block bg-[#5a8120] hover:bg-[#b9c228]">
                Upload Image
              </label>
            </>
          </div>

          {/* Full Name */}
          <Input
            {...register("fullName")}
            id="fullName"
            label="Full Name"
            error={errors}
            type="text"
            placeholder="Enter Full Name"
          />

          {/* Email */}
          <Input
            {...register("email")}
            id="email"
            label="Email"
            error={errors}
            type="text"
            placeholder="Enter Your Email"
          />

          {/* Phone */}
          <Input
            {...register("phone")}
            id="phone"
            label="Phone"
            error={errors}
            type="text"
            placeholder="Enter Your Number"
          />

          {/* Password */}
          {mode !== "edit" && (
            <>
              <Input
                {...register("password")}
                id="password"
                label="Password"
                error={errors}
                type="password"
                placeholder="Enter Your Password"
              />
              <Input
                {...register("confirmPassword")}
                error={errors}
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Enter Your Password Again"
              />
            </>
          )}

          {/* Address */}
          <Input
            {...register("address")}
            id="address"
            label="Address"
            error={errors}
            type="text"
            placeholder="Enter Your Address"
          />

          {/* Type of User */}
          <div>
            <label className="block mb-3 text-sm font-bold sm:text-base">
              Role of User
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserRole("customer")}
                className={`py-3 rounded-lg border-2 transition font-medium ${
                  userRole === "customer"
                    ? "border-[#5a8120] bg-[#5a8120] text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#5a8120]"
                }`}>
                Customer
              </button>
              <button
                type="button"
                onClick={() => setUserRole("admin")}
                className={`py-3 rounded-lg border-2 transition font-medium ${
                  userRole === "admin"
                    ? "border-[#5a8120] bg-[#5a8120] text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#5a8120]"
                }`}>
                Admin
              </button>
            </div>
          </div>

          {mode === "edit" && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
              disabled={isSubmitting}
              className={`w-full py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium mt-2 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }`}>
              Reset Password
            </button>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-[#5a8120] text-white rounded-lg hover:bg-[#b9c228] transition font-medium mt-2 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#5a8120] hover:bg-[#b9c228]"
            }`}>
            {isSubmitting
              ? "Saving..."
              : mode === "edit"
              ? "Save Changes"
              : "Save User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
