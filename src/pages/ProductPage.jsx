import { useEffect, useState } from "react";
import CardMenu from "../components/CardMenu";
import Checkbox from "../components/Checkbox";
import PromoSection from "../components/PromoSection";
import { useFetchData } from "../hooks/useFetchData";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import PriceRangeFilter from "../components/PriceRangeFilter";
import { Link, useSearchParams } from "react-router-dom";

function ProductPage() {
  // fetch data menu
  const { data: dataMenu, isLoading, error } = useFetchData("/data/menu.json");
  // state list menu yang sudah di filter
  const [filteredMenu, setFilteredMenu] = useState([]);
  // inisialisasi search params untuk filter
  const [searchParams, setSearchParams] = useSearchParams();

  // get data filter dari query params
  const getFiltersFromParams = () => {
    const search = searchParams.get("search") || "";
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
      categoryFilter,
      sortByFilter,
      priceRange: { minPrice, maxPrice },
    };
  };

  // state data filter
  const [searchFilter, setSearchFilter] = useState(getFiltersFromParams());

  // Update searchFilter ketika query params berubah
  useEffect(() => {
    setSearchFilter(getFiltersFromParams());
  }, [searchParams]);

  // Update filtered menu ketika data menu dan data filter berubah
  useEffect(() => {
    if (!dataMenu) return;

    setFilteredMenu(
      dataMenu.filter((menu) => {
        // Filter search
        const matchSearch =
          !searchFilter.search ||
          menu.name.toLowerCase().includes(searchFilter.search.toLowerCase());

        // Filter category
        const matchCategory =
          searchFilter.categoryFilter.length === 0 ||
          searchFilter.categoryFilter.some((cat) =>
            menu.category.includes(cat)
          );

        // Filter sortBy
        const matchSortBy =
          searchFilter.sortByFilter.length === 0 ||
          searchFilter.sortByFilter.some((sort) => menu.sortBy.includes(sort));

        // Filter price
        const price = menu.discountPrice || menu.price;
        const matchPrice =
          price >= searchFilter.priceRange.minPrice &&
          price <= searchFilter.priceRange.maxPrice;

        return matchSearch && matchCategory && matchSortBy && matchPrice;
      })
    );
  }, [dataMenu, searchFilter]);

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
      if (data.categoryFilter.length > 0)
        params.set("category", data.categoryFilter.join(","));
      if (data.sortByFilter.length > 0)
        params.set("sortBy", data.sortByFilter.join(","));
      if (data.priceRange.minPrice !== 0)
        params.set("minPrice", data.priceRange.minPrice);
      if (data.priceRange.maxPrice !== 1000000)
        params.set("maxPrice", data.priceRange.maxPrice);

      setSearchParams(params);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // handle pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredMenu.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1));
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // handle loading and error fetching data menu
  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;
  return (
    <>
      <div className="flex flex-col gap-10 mt-20 mb-20">
        {/* hero section */}
        <div className="px-20 py-20 bg-[url('/img/img-header-product.png')] font-medium text-white text-5xl bg-no-repeat bg-cover bg-center">
          We Provide Good Coffee and Healthy Meals
        </div>
        {/* promo section */}
        <div>
          <PromoSection />
        </div>
        <div className="px-20">
          <h1 className="font-medium text-5xl">
            Our <span className="text-[#8E6447]">Product</span>
          </h1>
          <div className="mt-10 grid grid-cols-[1fr_2fr] gap-5">
            {/* form filter */}
            <div className="rounded-xl bg-[#0B0909] text-white p-10 h-max">
              <form
                onSubmit={handleSubmit(onFilter)}
                className="flex flex-col gap-6"
              >
                <div className="flex justify-between items-center">
                  <h1 className="font-semibold text-lg">Filter</h1>
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
                    }}
                  >
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
            </div>

            {/* list menu */}
            <div className="flex flex-col gap-10">
              <div className="grid grid-cols-2 gap-5">
                {currentData.map((menu) => (
                  <Link key={menu.id} to={`/product/${menu.id}`}>
                    <CardMenu dataMenu={menu} />
                  </Link>
                ))}
              </div>
              {/* pagination list menu */}
              <div className="flex justify-center items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="size-10 rounded-full bg-[#E8E8E8] text-black flex items-center justify-center hover:bg-gray-200 transition"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => goToPage(index + 1)}
                    className={`size-10 rounded-full flex items-center justify-center transition ${
                      currentPage === index + 1
                        ? "bg-[#FF8906] text-[#0B0909]"
                        : "bg-[#E8E8E8] text-[#A0A3BD] hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  className="size-10 rounded-full bg-[#FF8906] text-white flex items-center justify-center hover:bg-[#e67a05] transition"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
