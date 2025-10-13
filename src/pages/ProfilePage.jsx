import { yupResolver } from "@hookform/resolvers/yup";
import bcrypt from "bcryptjs";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";
import { AuthContext } from "../context/AuthContext";

const EditProfileFormSchema = yup.object({
  fullName: yup.string().min(3, "Name must be at least 3 characters"),
  email: yup.string().email("Invalid email format"),
  phone: yup.string().min(10, "Phone must be at least 10 digits"),
  password: yup
    .string()
    .test("len", "Password must be at least 6 characters", (val) => {
      if (val === undefined || val === "") return true;
      return val.length >= 6;
    }),
  address: yup.string().min(5, "Address must be at least 5 characters"),
});

function ProfilePage() {
  const { userLogin, setUserLogin } = useContext(AuthContext);
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });
  const [profileImage, setProfileImage] = useState(
    userLogin?.profileImage || "/img/empty-photo-profile.jpeg"
  );
  const profileImg = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(EditProfileFormSchema),
  });

  useEffect(() => {
    if (userLogin) {
      setValue("fullName", userLogin.fullName || "");
      setValue("email", userLogin.email || "");
      setValue("phone", userLogin.phone || "");
      setValue("address", userLogin.address || "");
      if (userLogin.profileImage) {
        setProfileImage(userLogin.profileImage);
      }
    }
  }, [userLogin, setValue]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setAlertStatus({
          type: "error",
          message: "Image size must be less than 2MB",
        });
        return;
      }

      // Validasi tipe file
      if (!file.type.startsWith("image/")) {
        setAlertStatus({
          type: "error",
          message: "File must be an image",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfileImage(imageData);

        // Update di localStorage
        const usersData = JSON.parse(localStorage.getItem("users") || "[]");
        const updatedUsers = usersData.map((user) =>
          user.id === userLogin.id ? { ...user, profileImage: imageData } : user
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        // Update context
        setUserLogin({ ...userLogin, profileImage: imageData });

        setAlertStatus({
          type: "success",
          message: "Profile photo updated successfully!",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const usersData = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = usersData.findIndex((user) => user.id === userLogin.id);

      if (userIndex === -1) {
        setAlertStatus({
          type: "error",
          message: "User not found",
        });
        return;
      }

      const currentUser = usersData[userIndex];

      // Jika password diisi, hash password baru
      let updatedPassword = currentUser.password;
      if (data.password && data.password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        updatedPassword = await bcrypt.hash(data.password, salt);
      }

      // Update hanya field yang diisi
      const updatedUser = {
        ...currentUser,
        fullName: data.fullName || currentUser.fullName,
        email: data.email || currentUser.email,
        phone: data.phone || currentUser.phone,
        address: data.address || currentUser.address,
        password: updatedPassword,
      };

      usersData[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(usersData));

      // Update context (tanpa password)
      setUserLogin({
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
      });

      setAlertStatus({
        type: "success",
        message: "Profile updated successfully!",
      });

      // Clear password field setelah berhasil
      setValue("password", "");
    } catch (error) {
      setAlertStatus({
        type: "error",
        message: `An error occurred while updating profile: ${error}`,
      });
    }
  };
  return (
    <div className="px-4 py-6 mt-16 mb-10 sm:px-6 sm:py-8 sm:mt-20 md:px-10 md:mb-16 lg:px-16 xl:px-20 lg:mb-20">
      <Alert
        type={alertStatus.type}
        message={alertStatus.message}
        onClose={() => setAlertStatus({ type: "", message: "" })}
      />
      <h1 className="text-2xl font-medium sm:text-3xl md:text-4xl lg:text-5xl">
        Profile
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] mt-5 sm:mt-6 md:mt-8 lg:mt-10 gap-4 sm:gap-5">
        <div className="p-5 sm:p-6 md:p-10 flex flex-col gap-4 sm:gap-5 border border-[#E8E8E8] items-center h-max rounded-lg md:rounded-none">
          <div className="text-center">
            <h2 className="font-medium text-lg sm:text-xl text-[#0B132A]">
              {userLogin?.fullName || "Guest User"}
            </h2>
            <p className="text-[#4F5665] text-sm sm:text-base">
              {userLogin?.email || "email@example.com"}
            </p>
          </div>
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
            <img
              className="object-cover w-full h-full rounded-full"
              src={profileImage}
              alt="Profile"
            />
          </div>
          <input
            ref={profileImg}
            type="file"
            id="upload-photo"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            type="button"
            onClick={() => profileImg.current.click()}
            className="bg-[#FF8906] py-4 w-full text-sm sm:text-base">
            Upload New Photo
          </Button>
          <div>
            Since{" "}
            <span className="font-semibold text-[#4F5665]">
              {moment(userLogin?.joinDate).format("DD MMMM YYYY") || ""}
            </span>
          </div>
        </div>
        <div className="border border-[#E8E8E8] py-5 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col gap-5 sm:gap-6 md:gap-7 rounded-lg md:rounded-none">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 sm:gap-6 md:gap-7">
            <Input
              {...register("fullName")}
              error={errors}
              id="fullName"
              type="text"
              label="Full Name"
              placeholder="Complete Your Full Name"
            />
            <Input
              {...register("email")}
              error={errors}
              id="email"
              type="email"
              label="Email"
              placeholder="Complete Your Email"
            />
            <Input
              {...register("phone")}
              error={errors}
              id="phone"
              type="text"
              label="Phone"
              placeholder="Complete Your Number"
            />
            <Input
              {...register("password")}
              error={errors}
              id="password"
              type="password"
              label="Password"
              placeholder="*******"
              passwordInProfile={true}
            />
            <Input
              {...register("address")}
              error={errors}
              id="address"
              type="text"
              label="Address"
              placeholder="Complete Your Address"
            />
            <Button
              type="submit"
              className="bg-[#FF8906] w-full sm:w-auto text-sm sm:text-base mt-2">
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
