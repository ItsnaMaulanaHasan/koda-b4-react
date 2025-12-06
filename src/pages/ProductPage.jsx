import { useCallback, useEffect, useState } from "react";
import { Link, ScrollRestoration, useSearchParams } from "react-router-dom";
import CardMenu from "../components/CardMenu";
import Drawer from "../components/Drawer";
import FilterSearch from "../components/FilterSearch";
import PromoSection from "../components/PromoSection";
import { DrawerFilterContext } from "../context/DrawerContext";
import { useFetchData } from "../hooks/useFetchData";

function ProductPage() {
  // handle drawer
  const [showDrawer, setShowDrawer] = useState(false);

  // state untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  // inisialisasi search params untuk filter
  const [searchParams] = useSearchParams();

  // get data filter dari query params
  const getFiltersFromParams = useCallback(() => {
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
  }, [searchParams]);

  // state data filter
  const [searchFilter, setSearchFilter] = useState(getFiltersFromParams());

  // update searchFilter ketika query params berubah
  useEffect(() => {
    setSearchFilter(getFiltersFromParams());
  }, [getFiltersFromParams, searchParams]);

  // build URL dinamis dengan semua filter
  const buildURL = () => {
    const baseURL = import.meta.env.VITE_BASE_URL + "/products";
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: limit.toString(),
    });

    // add search
    if (searchFilter.search) {
      params.set("q", searchFilter.search);
    }

    // add categories
    if (searchFilter.categoryFilter.length > 0) {
      searchFilter.categoryFilter.forEach((cat) => {
        params.append("cat", cat);
      });
    }

    // add sort by name
    if (searchFilter.sortName) {
      params.set("sort[name]", searchFilter.sortName);
    }

    // add sort by price
    if (searchFilter.sortPrice) {
      params.set("sort[price]", searchFilter.sortPrice);
    }

    // add price range
    if (searchFilter.priceRange.minPrice > 0) {
      params.set("minprice", searchFilter.priceRange.minPrice.toString());
    }
    if (searchFilter.priceRange.maxPrice < 1000000) {
      params.set("maxprice", searchFilter.priceRange.maxPrice.toString());
    }

    return `${baseURL}?${params.toString()}`;
  };

  // fetch data product dengan url dinamis
  const {
    data: response = {},
    isLoading,
    error,
    refetch,
  } = useFetchData(buildURL());

  const dataMenu = response.data || [];
  const meta = response.meta || {};
  const totalPages = meta.totalPages || 1;

  // refetch saat filter atau page berubah
  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [searchFilter, currentPage, refetch]);

  // reset ke page 1 saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchFilter.search,
    searchFilter.categoryFilter,
    searchFilter.sortName,
    searchFilter.sortPrice,
    searchFilter.priceRange,
  ]);

  // handle pagination
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <DrawerFilterContext.Provider value={{ showDrawer, setShowDrawer }}>
      <ScrollRestoration />
      <div className="flex flex-col gap-10 mb-20 mt-13 md:mt-20">
        {/* hero section */}
        <div className="hidden md:block relative h-[400px] bg-gradient-to-br from-[#5a8120] to-[#7da832] overflow-hidden">
          <div className="absolute inset-0 bg-[url('/img/img-header-product.png')] bg-cover bg-center opacity-30"></div>
          <div className="relative z-10 flex items-center h-full px-8 sm:px-12 lg:px-16 xl:px-24">
            <div className="max-w-3xl">
              <h1 className="mb-6 text-4xl font-bold leading-tight text-white lg:text-5xl xl:text-6xl">
                We Provide Fresh Green Drinks and Nutrition for Your Diet
              </h1>
              <p className="text-xl text-white">
                Explore our collection of healthy and delicious drinks
              </p>
            </div>
          </div>
        </div>

        {/* Filter Search on Mobile */}
        <div className="sticky bg-white shadow-md z-100 top-15 md:hidden">
          <div className="flex items-center justify-center gap-4 px-6 py-4">
            <FilterSearch isMobile={true} />
          </div>
        </div>

        {/* drawer filter search mobile */}
        <Drawer
          drawerCtx={{ showDrawer, setShowDrawer }}
          bg="bg-[#0B0909]"
          textColor="text-white">
          <FilterSearch />
        </Drawer>

        {/* promo section */}
        <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <PromoSection />
        </div>

        {/* main content */}
        <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          {/* title */}
          <h1 className="text-2xl font-medium sm:text-3xl md:text-4xl lg:text-5xl">
            Our <span className="text-[#5a8120]">Product</span>
          </h1>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5">
            {/* form filter dekstop */}
            <div className="hidden md:block rounded-xl bg-[#0B0909] text-white p-10 h-max">
              <FilterSearch />
            </div>

            {/* list menu */}
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-[#5a8120] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600">Loading...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="p-8 text-center border border-red-200 rounded-lg bg-red-50">
                  <img src="/icon/icon-warning.svg" alt="Icon Warning" />
                  <p className="font-medium text-red-600">Error: {error}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                {/* Pagination Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                      <img
                        className="size-7"
                        src="/icon/icon-food.svg"
                        alt="Icon Food"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Showing</p>
                      <p className="font-semibold text-gray-800">
                        {dataMenu.length} of {meta.totalData || 0} products
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-2 text-sm text-gray-600 rounded-lg bg-gray-50">
                    Page{" "}
                    <span className="font-bold text-[#5a8120]">
                      {currentPage}
                    </span>{" "}
                    of {totalPages}
                  </div>
                </div>

                {/* list product */}
                {dataMenu.length === 0 ? (
                  <div className="content-center h-full py-10 text-gray-500 justify-items-center">
                    <p className="text-xl">Menu data not found</p>
                    <p className="mt-2">Check the filters you applied!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-2 xl:grid-cols-3">
                    {dataMenu.map((menu) => (
                      <Link
                        key={menu.id}
                        to={`/product/${menu.id}`}
                        className="transition-all duration-300 transform hover:-translate-y-2">
                        <CardMenu dataMenu={menu} />
                      </Link>
                    ))}
                  </div>
                )}

                {/* pagination list menu */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="size-10 rounded-full bg-[#E8E8E8] text-black flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    ←
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    if (
                      totalPages <= 5 ||
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={index + 1}
                          onClick={() => goToPage(index + 1)}
                          className={`size-10 rounded-full flex items-center justify-center transition ${
                            currentPage === index + 1
                              ? "bg-[#5a8120] text-[#0B0909]"
                              : "bg-[#E8E8E8] text-[#A0A3BD] hover:bg-gray-300"
                          }`}>
                          {index + 1}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span key={pageNumber} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="size-10 rounded-full bg-[#5a8120] text-white flex items-center justify-center hover:bg-[#b9c228] transition disabled:opacity-50 disabled:cursor-not-allowed">
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DrawerFilterContext.Provider>
  );
}

export default ProductPage;
