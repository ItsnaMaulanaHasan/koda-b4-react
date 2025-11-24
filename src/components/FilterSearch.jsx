import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import Checkbox from "../components/Checkbox";
import PriceRangeFilter from "../components/PriceRangeFilter";
import { DrawerFilterContext } from "../context/DrawerContext";
import { useFetchData } from "../hooks/useFetchData";
import Button from "./Button";

function FilterSearch({ isMobile = false }) {
  const {
    data: { data: categories = [] },
  } = useFetchData(import.meta.env.VITE_BASE_URL + "/categories");

  // context drawer filter
  const { showDrawer, setShowDrawer } = useContext(DrawerFilterContext);
  // inisialisasi search params untuk filter
  const [searchParams, setSearchParams] = useSearchParams();

  // get data filter dari query params
  const getFiltersFromParams = () => {
    const search = searchParams.get("q") || "";
    const categoryFilter = searchParams.getAll("cat") || [];
    const sortName = searchParams.get("sort[name]") || "";
    const sortPrice = searchParams.get("sort[price]") || "";
    const minPrice = parseInt(searchParams.get("minprice")) || 0;
    const maxPrice = parseInt(searchParams.get("maxprice")) || 1000000;

    return {
      search,
      categoryFilter,
      sortName,
      sortPrice,
      priceRange: { minPrice, maxPrice },
    };
  };

  // inisialisasi hooks useForm untuk form filter
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: getFiltersFromParams(),
  });

  // handle input category dan sortby
  const [categoryFilter, setCategoryFilter] = useState(
    getFiltersFromParams().categoryFilter
  );
  const [sortName, setSortName] = useState(getFiltersFromParams().sortName);
  const [sortPrice, setSortPrice] = useState(getFiltersFromParams().sortPrice);

  const handleCategoryChange = (category) => {
    const currentCategory = categoryFilter.includes(category)
      ? categoryFilter.filter((b) => b !== category)
      : [...categoryFilter, category];

    setCategoryFilter(currentCategory);
    setValue("categoryFilter", currentCategory);
  };

  const handleSortNameChange = (value) => {
    const newSortName = sortName === value ? "" : value;
    setSortName(newSortName);
    setValue("sortName", newSortName);
  };

  const handleSortPriceChange = (value) => {
    const newSortPrice = sortPrice === value ? "" : value;
    setSortPrice(newSortPrice);
    setValue("sortPrice", newSortPrice);
  };

  const handlePriceChange = (priceData) => {
    setValue("priceRange", priceData);
  };

  // handle form filter
  const onFilter = (data) => {
    try {
      const params = new URLSearchParams();

      if (data.search) params.set("q", data.search);

      if (data.categoryFilter.length > 0) {
        data.categoryFilter.forEach((cat) => {
          params.append("cat", cat);
        });
      }

      if (data.sortName) params.set("sort[name]", data.sortName);
      if (data.sortPrice) params.set("sort[price]", data.sortPrice);

      if (data.priceRange.minPrice !== 0)
        params.set("minprice", data.priceRange.minPrice);
      if (data.priceRange.maxPrice !== 1000000)
        params.set("maxprice", data.priceRange.maxPrice);

      setSearchParams(params);
      setShowDrawer(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {isMobile ? (
        <form
          onSubmit={handleSubmit(onFilter)}
          className="flex items-center w-full gap-4">
          <div className="flex border rounded-md py-3 px-4 border-[#DEDEDE] w-full gap-4">
            <img src="/icon/icon-search-black.svg" alt="Icon Search" />
            <input
              type="search"
              placeholder="Find Product"
              {...register("search")}
              className="focus:outline-none w-full text-sm placeholder:text-[#4F5665]"
            />
          </div>
          <button type="submit" className="hidden"></button>
          <button
            type="button"
            onClick={() => setShowDrawer(!showDrawer)}
            className="bg-[#5a8120] p-4 rounded cursor-pointer">
            <img
              className="size-full"
              src="/icon/icon-filter.svg"
              alt="Icon Filter"
            />
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(onFilter)} className="flex flex-col gap-6">
          {/* button reset */}
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Filter</h1>
            <button
              type="reset"
              className="cursor-pointer"
              onClick={() => {
                reset();
                setCategoryFilter([]);
                setSortName("");
                setSortPrice("");
                setSearchParams("");
              }}>
              Reset Filter
            </button>
          </div>

          {/* filter search */}
          <div className="hidden md:flex flex-col gap-2">
            <label className="font-semibold" htmlFor="search">
              Search
            </label>
            <input
              className="p-3 rounded-sm bg-[#FCFDFE] placeholder:text-[#696F79] placeholder:text-sm text-black"
              type="search"
              id="search"
              placeholder="Search Your Product"
              {...register("search")}
            />
          </div>

          {/* filter category */}
          <div className="flex flex-col gap-5">
            <h1 className="font-semibold">Category</h1>
            {categories.map((category) => (
              <Checkbox
                key={category.id}
                checked={categoryFilter.includes(category.name)}
                onChange={() => handleCategoryChange(category.name)}
                label={category.name}
              />
            ))}
          </div>

          {/* sort by name */}
          <div className="flex flex-col gap-4">
            <h1 className="font-semibold">Sort by Name</h1>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="sortName"
                value="asc"
                checked={sortName === "asc"}
                onChange={() => handleSortNameChange("asc")}
                className="w-4 h-4 text-[#5a8120] focus:ring-[#5a8120] cursor-pointer"
              />
              <span className="text-sm">A to Z</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="sortName"
                value="desc"
                checked={sortName === "desc"}
                onChange={() => handleSortNameChange("desc")}
                className="w-4 h-4 text-[#5a8120] focus:ring-[#5a8120] cursor-pointer"
              />
              <span className="text-sm">Z to A</span>
            </label>
          </div>

          {/* sort by price */}
          <div className="flex flex-col gap-4">
            <h1 className="font-semibold">Sort by Price</h1>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="sortPrice"
                value="asc"
                checked={sortPrice === "asc"}
                onChange={() => handleSortPriceChange("asc")}
                className="w-4 h-4 text-[#5a8120] focus:ring-[#5a8120] cursor-pointer"
              />
              <span className="text-sm">Cheapest</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="sortPrice"
                value="desc"
                checked={sortPrice === "desc"}
                onChange={() => handleSortPriceChange("desc")}
                className="w-4 h-4 text-[#5a8120] focus:ring-[#5a8120] cursor-pointer"
              />
              <span className="text-sm">Most Expensive</span>
            </label>
          </div>

          {/* filter price range */}
          <div>
            <PriceRangeFilter onPriceChange={handlePriceChange} />
          </div>

          {/* button apply filter */}
          <Button type="submit" className="bg-[#5a8120] text-[#0B0909]">
            Apply Filter
          </Button>
        </form>
      )}
    </>
  );
}

export default FilterSearch;
