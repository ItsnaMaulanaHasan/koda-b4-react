import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import Input from "../components/Input";
import { DrawerNavbarContext } from "../context/DrawerContext";
import Button from "./Button";

const SidebarMobile = ({ userLogin, handleLogout }) => {
  const { setShowDrawer } = useContext(DrawerNavbarContext);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [searchParams] = useSearchParams();
  const getNavLinkClass = ({ isActive }) =>
    `hover:font-bold w-full py-3 transition duration-300 border-b ${
      isActive ? "border-b-[#FF8906]" : "border-b-[#E8E8E8]"
    }`;

  useEffect(() => {
    const search = searchParams.get("search") || "";
    setValue("search", search);
  }, [searchParams, setValue]);

  const onSearch = (data) => {
    try {
      const params = new URLSearchParams();
      if (data.search) params.set("search", data.search);
      setShowDrawer(false);
      navigate(`/product?${params.toString()}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setShowDrawer(false);
  };
  return (
    <div className="flex flex-col justify-between h-full px-2">
      <div className="flex flex-col w-full gap-5">
        <div className="flex items-center justify-between">
          <img src="/icon/logo-original.svg" alt="Logo HIFI" />
          <button
            onClick={() => setShowDrawer(false)}
            className="text-xs font-bold text-red-500 border-2 border-red-500 rounded-full size-5">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit(onSearch)}>
          <Input
            {...register("search")}
            id="search"
            type="search"
            label="Search Product"
            placeholder="Find Product"
          />
          <button type="submit" className="hidden"></button>
        </form>
        <ul className="flex flex-col w-full items-center gap-3 text-sm text-[#0B132A] lg:gap-10 lg:text-base">
          <NavLink
            to="/"
            className={getNavLinkClass}
            onClick={() => setShowDrawer(false)}>
            <li>Home</li>
          </NavLink>
          <NavLink
            to="/product"
            className={getNavLinkClass}
            onClick={() => setShowDrawer(false)}>
            <li>Product</li>
          </NavLink>
        </ul>
      </div>

      <div className="flex flex-col gap-5">
        {userLogin ? (
          <>
            <div className="flex items-center gap-3 p-3 border border-[#E8E8E8] rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 overflow-hidden rounded-full">
                <img
                  className="object-cover w-full h-full"
                  src={userLogin.profileImage || "/img-menus/image1.png"}
                  alt="Profile"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0B132A] truncate">
                  {userLogin.fullName}
                </p>
                <p className="text-xs text-[#4F5665] truncate">
                  {userLogin.email}
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleNavigation("/profile")}
              className="px-3 text-sm border border-[#0B132A] text-[#0B132A] lg:px-4 whitespace-nowrap lg:text-base">
              Profile
            </Button>
            <Button
              onClick={() => {
                handleLogout();
                setShowDrawer(false);
              }}
              className="px-3 text-sm text-white bg-red-500 lg:px-4 whitespace-nowrap lg:text-base">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => handleNavigation("/auth/login")}
              className="px-3 text-sm text-[#0B132A] border border-[#0B132A] lg:px-4 whitespace-nowrap lg:text-base">
              Sign In
            </Button>
            <Button
              onClick={() => handleNavigation("/auth/register")}
              className="px-3 lg:px-4 bg-[#FF8906] whitespace-nowrap text-sm lg:text-base">
              Sign Up
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SidebarMobile;
