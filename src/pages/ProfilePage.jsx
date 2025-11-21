import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as yup from "yup";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";
import { AuthContext } from "../context/AuthContext";
import { setDataProfile } from "../redux/reducers/profile";

const EditProfileFormSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Name cannot be empty")
    .min(3, "Name must be at least 3 characters"),
  email: yup
    .string()
    .trim()
    .required("Email cannot be empty")
    .email("Invalid email format"),
  phone: yup
    .string()
    .trim()
    .required("Phone cannot be empty")
    .min(10, "Phone must be at least 10 digits"),
  address: yup
    .string()
    .trim()
    .required("Address cannot be empty")
    .min(5, "Address must be at least 5 characters"),
});

function ProfilePage() {
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const { accessToken } = useContext(AuthContext);

  // get data user login from redux
  const userLogin = useSelector((state) => state.profile.dataProfile);
  const dispatch = useDispatch();

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
    defaultValues: {
      fullName: userLogin?.fullName,
      email: userLogin?.email,
      phone: userLogin?.phone,
      address: userLogin?.address,
    },
  });

  useEffect(() => {
    if (userLogin) {
      if (userLogin.profileImage) {
        setProfileImage(userLogin.profileImage);
      }
    }
  }, [userLogin, setValue]);

  const handleImageUpload = async (e) => {
    setIsUploadingPhoto(true);
    const file = e.target.files[0];
    if (!file) return;
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload ke backend
        const formData = new FormData();
        formData.append("profilePhoto", file);

        const res = await fetch(
          import.meta.env.VITE_BASE_URL + "/profiles/photo",
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          }
        );

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.message || "Upload failed");
        }

        const result = await res.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        if (result.data?.profilePhoto) {
          dispatch(
            setDataProfile({
              ...userLogin,
              profilePhoto: result.data.profilePhoto,
            })
          );
          setProfileImage(result.data.profilePhoto);
        }

        setAlertStatus({
          type: "success",
          message: "Profile photo updated successfully!",
        });
      } catch (error) {
        let errorMessage = "Failed to upload profile photo";
        if (error.message) {
          errorMessage = error.message;
        } else if (!navigator.onLine) {
          errorMessage = "No internet connection";
        }

        setAlertStatus({
          type: "error",
          message: errorMessage,
        });
        setProfileImage(
          userLogin?.profilePhoto || "/img/empty-photo-profile.jpeg"
        );
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const onSubmit = async (data) => {
    setIsUpdating(true);
    try {
      const body = new URLSearchParams();
      if (data.fullName) body.append("fullName", data.fullName);
      if (data.email) body.append("email", data.email);
      if (data.phone) body.append("phone", data.phone);
      if (data.address) body.append("address", data.address);

      const res = await fetch(import.meta.env.VITE_BASE_URL + "/profiles", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${accessToken}`,
        },
        body,
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Update profile failed");
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      dispatch(setDataProfile(result.data));

      setAlertStatus({
        type: "success",
        message: "Profile updated successfully!",
      });
    } catch (error) {
      let errorMessage = "Update profile failed";
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
      setIsUpdating(false);
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
              className="object-contain w-full h-full rounded-full"
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
            className="bg-[#FF8906] py-4 w-full text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
            {isUploadingPhoto ? "Uploading..." : "Upload New Photo"}
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
              disabled={isUpdating}
              placeholder="Complete Your Full Name"
            />
            <Input
              {...register("email")}
              error={errors}
              id="email"
              type="email"
              label="Email"
              disabled={isUpdating}
              placeholder="Complete Your Email"
            />
            <Input
              {...register("phone")}
              error={errors}
              id="phone"
              type="text"
              label="Phone"
              disabled={isUpdating}
              placeholder="Complete Your Number"
            />
            <Input
              {...register("address")}
              error={errors}
              id="address"
              type="text"
              label="Address"
              disabled={isUpdating}
              placeholder="Complete Your Address"
            />
            <Link
              to="/forgot-password"
              className="text-[#FF8906] text-xs sm:text-sm">
              Set New Password
            </Link>
            <Button
              disabled={isUpdating}
              type="submit"
              className="bg-[#FF8906] w-full sm:w-auto text-sm sm:text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {!isUpdating ? "Save Changes" : "Updating Profile..."}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
