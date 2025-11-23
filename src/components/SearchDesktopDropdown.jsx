import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "./Button";
import Input from "./Input";

const SearchDesktopDropdown = ({ setShowSearchDesktop }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const search = searchParams.get("search") || "";
    setValue("search", search);
  }, [searchParams, setValue]);

  const onSearch = (data) => {
    try {
      const params = new URLSearchParams();
      if (data.search) params.set("q", data.search);
      setShowSearchDesktop(false);
      navigate(`/product?${params.toString()}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute right-0 z-50 w-80 p-4 mt-2 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit(onSearch)} className="flex flex-col gap-3">
        <Input
          {...register("search")}
          id="search"
          type="search"
          placeholder="Find Product"
          label="Search Product"
          className="w-full px-4 py-2 text-sm border border-[#DEDEDE] rounded-lg focus:outline-none focus:border-[#FF8906] transition"
        />
        <Button type="submit" className="bg-[#FF8906] w-full py-2">
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchDesktopDropdown;
