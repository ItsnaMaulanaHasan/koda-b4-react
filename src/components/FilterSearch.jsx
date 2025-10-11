import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import Checkbox from "../components/Checkbox";
import PriceRangeFilter from "../components/PriceRangeFilter";
import { DrawerFilterContext } from "../context/DrawerContext";
import { SearchFilterContext } from "../context/SearchFilterContext,jsx";
import Button from "./Button";

function FilterSearch({ isMobile = false }) {
  const { showDrawer, setShowDrawer } = useContext(DrawerFilterContext);
  // state data filter
  const { setSearchFilter } = useContext(SearchFilterContext);
  // inisialisasi search params untuk filter
  const [searchParams, setSearchParams] = useSearchParams();
  // get data filter dari query params
  const getFiltersFromParams = () => {
    const search = searchParams.get("search") || "";
    const searchMobile = searchParams.get("searchMobile") || "";
    const categoryFilter = searchParams.get("category")
      ? searchParams.get("category").split(",")
      : [];
    const sortByFilter = searchParams.get("sortBy")
      ? searchParams.get("sortBy").split(",")
      : [];
    const minPrice = parseInt(searchParams.get("minPrice")) || 0;
    const maxPrice = parseInt(searchParams.get("maxPrice")) || 1000000;

    return {
      search,
      searchMobile,
      categoryFilter,
      sortByFilter,
      priceRange: { minPrice, maxPrice },
    };
  };
  // inisialisasi hooks useForm untuk form filter
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: getFiltersFromParams(),
  });
  // handle input checkbox
  const [categoryFilter, setCategoryFilter] = useState(
    getFiltersFromParams().categoryFilter
  );
  const [sortByFilter, setSortByFilter] = useState(
    getFiltersFromParams().sortByFilter
  );

  const handleCategoryChange = (category) => {
    const currentCategory = categoryFilter.includes(category)
      ? categoryFilter.filter((b) => b !== category)
      : [...categoryFilter, category];

    setCategoryFilter(currentCategory);
    setValue("categoryFilter", currentCategory);
  };

  const handleSortByChange = (sortby) => {
    const currentSortBy = sortByFilter.includes(sortby)
      ? sortByFilter.filter((b) => b !== sortby)
      : [...sortByFilter, sortby];

    setSortByFilter(currentSortBy);
    setValue("sortByFilter", currentSortBy);
  };

  const handlePriceChange = (priceData) => {
    setValue("priceRange", priceData);
  };
  // handle form filter
  const onFilter = (data) => {
    try {
      const params = new URLSearchParams();

      if (data.search) params.set("search", data.search);
      if (data.searchMobile) params.set("searchMobile", data.searchMobile);
      if (data.categoryFilter.length > 0)
        params.set("category", data.categoryFilter.join(","));
      if (data.sortByFilter.length > 0)
        params.set("sortBy", data.sortByFilter.join(","));
      if (data.priceRange.minPrice !== 0)
        params.set("minPrice", data.priceRange.minPrice);
      if (data.priceRange.maxPrice !== 1000000)
        params.set("maxPrice", data.priceRange.maxPrice);

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
          className="w-full flex items-center gap-4">
          <div className="flex border rounded-md py-3 px-4 border-[#DEDEDE] w-full gap-4">
            <img src="/public/icon/icon-search-black.svg" alt="Icon Search" />
            <input
              type="text"
              placeholder="Find Product"
              {...register("searchMobile")}
              className="focus:outline-none w-full text-sm placeholder:text-[#4F5665]"
            />
          </div>
          <button type="submit" className="hidden"></button>
          <button
            type="button"
            onClick={() => setShowDrawer(!showDrawer)}
            className="bg-[#FF8906] p-4 rounded cursor-pointer">
            <img
              className="size-full"
              src="/public/icon/icon-filter.svg"
              alt="Icon Filter"
            />
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(onFilter)} className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Filter</h1>
            <button
              type="reset"
              className="cursor-pointer"
              onClick={() => {
                reset();
                setCategoryFilter([]);
                setSortByFilter([]);
                setSearchFilter({
                  search: "",
                  categoryFilter: [],
                  sortByFilter: [],
                  priceRange: { minPrice: 0, maxPrice: 1000000 },
                });
                setSearchParams("");
              }}>
              Reset Filter
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="search">
              Search
            </label>
            <input
              className="p-3 rounded-sm bg-[#FCFDFE] placeholder:text-[#696F79] placeholder:text-sm text-black"
              type="text"
              id="search"
              placeholder="Search Your Product"
              {...register("search")}
            />
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="font-semibold" htmlFor="search">
              Category
            </h1>
            <Checkbox
              checked={categoryFilter.includes("FavoriteProduct")}
              onChange={() => handleCategoryChange("FavoriteProduct")}
              label="Favorite Product"
            />
            <Checkbox
              checked={categoryFilter.includes("Coffe")}
              onChange={() => handleCategoryChange("Coffe")}
              label="Coffe"
            />
            <Checkbox
              checked={categoryFilter.includes("NonCoffe")}
              onChange={() => handleCategoryChange("NonCoffe")}
              label="Non Coffe"
            />
            <Checkbox
              checked={categoryFilter.includes("Foods")}
              onChange={() => handleCategoryChange("Foods")}
              label="Foods"
            />
            <Checkbox
              checked={categoryFilter.includes("AddOn")}
              onChange={() => handleCategoryChange("AddOn")}
              label="Add-On"
            />
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="font-semibold" htmlFor="search">
              Sort By
            </h1>
            <Checkbox
              checked={sortByFilter.includes("BuyGet1")}
              onChange={() => handleSortByChange("BuyGet1")}
              label="Buy 1 Get 1"
            />
            <Checkbox
              checked={sortByFilter.includes("Flashsale")}
              onChange={() => handleSortByChange("Flashsale")}
              label="Flashsale"
            />
            <Checkbox
              checked={sortByFilter.includes("BirthdayPackage")}
              onChange={() => handleSortByChange("BirthdayPackage")}
              label="Birthday Package"
            />
            <Checkbox
              checked={sortByFilter.includes("Cheap")}
              onChange={() => handleSortByChange("Cheap")}
              label="Cheap"
            />
          </div>
          <div>
            <PriceRangeFilter onPriceChange={handlePriceChange} />
          </div>
          <Button type="submit" className="bg-[#FF8906] text-[#0B0909]">
            Apply Filter
          </Button>
        </form>
      )}
    </>
  );
}

export default FilterSearch;
