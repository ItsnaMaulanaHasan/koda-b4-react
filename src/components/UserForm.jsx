import { yupResolver } from "@hookform/resolvers/yup";
import bcrypt from "bcryptjs";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { DrawerAdminContext } from "../context/DrawerContext";
import Input from "./Input";

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
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
});

const UserForm = ({ user = null, mode = "add" }) => {
  const { setShowDrawer } = useContext(DrawerAdminContext);
  const [image, setImage] = useState(null);
  const [userType, setUserType] = useState("customer");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(AddUserSchema),
  });

  // Auto-fill form jika mode edit
  useEffect(() => {
    if (mode === "edit" && user) {
      setValue("fullName", user.fullName);
      setValue("email", user.email);
      setValue("phone", user.phone);
      setValue("password", user.password || "******"); // Show placeholder for existing password
      setValue("address", user.address);

      // Set image jika ada
      if (user.image) {
        setImage(user.image);
      }

      // Set user type
      if (user.role) {
        setUserType(user.role);
      }
    } else {
      // Reset form untuk mode add
      reset();
      setImage(null);
      setUserType("customer");
    }
  }, [mode, user, setValue, reset]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Hash password hanya jika password berubah (tidak sama dengan placeholder)
      let hashedPassword = data.password;
      if (mode === "add" || data.password !== "******") {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(data.password, salt);
      } else if (mode === "edit") {
        // Gunakan password lama jika tidak diubah
        hashedPassword = user.password;
      }

      // Get join date (gunakan yang lama jika edit, buat baru jika add)
      const joinDate =
        mode === "edit" && user.joinDate
          ? user.joinDate
          : new Date().toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

      const userData = {
        id: mode === "edit" ? user.id : Date.now(),
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        address: data.address,
        role: userType,
        image: image || "",
        joinDate: joinDate,
      };

      if (mode === "edit") {
        // Update existing user in localStorage
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const userIndex = existingUsers.findIndex((u) => u.id === user.id);

        if (userIndex !== -1) {
          // Check if email changed and already exists
          const emailExists = existingUsers.some(
            (u) => u.email === data.email && u.id !== user.id
          );
          if (emailExists) {
            alert("Email already registered by another user!");
            return;
          }

          existingUsers[userIndex] = userData;
          localStorage.setItem("users", JSON.stringify(existingUsers));
          console.log("User Updated:", userData);
          alert("User updated successfully!");
        }
      } else {
        // Add new user to localStorage
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

        // Check if email already exists
        const emailExists = existingUsers.some(
          (user) => user.email === data.email
        );
        if (emailExists) {
          alert("Email already registered!");
          return;
        }

        existingUsers.push(userData);
        localStorage.setItem("users", JSON.stringify(existingUsers));
        console.log("User Added:", userData);
        alert("User added successfully!");
      }

      // Close drawer
      setShowDrawer(false);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user");
    }
  };

  return (
    <div className="flex flex-col h-full">
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
            <label className="block mb-2 text-sm font-medium">Image User</label>

            {/* Image Preview */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-16 h-16 overflow-hidden bg-gray-100 rounded-lg">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <input
              type="file"
              id="user-image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="user-image-upload"
              className="inline-block px-4 py-2 bg-[#FF8906] rounded-lg cursor-pointer hover:bg-[#e57a05] transition text-sm font-medium">
              Upload
            </label>
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
          <Input
            {...register("password")}
            id="password"
            label="Password"
            error={errors}
            type="password"
            placeholder={
              mode === "edit"
                ? "Leave blank to keep current password"
                : "Enter Your Password"
            }
            passwordInProfile={true}
          />
          {mode === "edit" && (
            <p className="-mt-3 text-xs text-gray-500">
              Leave blank to keep the current password
            </p>
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
            <label className="block mb-3 text-sm font-medium">
              Type of User
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType("customer")}
                className={`py-3 rounded-lg border-2 transition font-medium ${
                  userType === "customer"
                    ? "border-[#FF8906] bg-[#FF8906] text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#FF8906]"
                }`}>
                Normal User
              </button>
              <button
                type="button"
                onClick={() => setUserType("admin")}
                className={`py-3 rounded-lg border-2 transition font-medium ${
                  userType === "admin"
                    ? "border-[#FF8906] bg-[#FF8906] text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#FF8906]"
                }`}>
                Admin
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#FF8906] text-white rounded-lg hover:bg-[#e57a05] transition font-medium mt-2">
            {mode === "edit" ? "Update User" : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
