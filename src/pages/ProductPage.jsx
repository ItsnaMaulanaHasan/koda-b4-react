import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CardMenu from "../components/CardMenu";
import Drawer from "../components/Drawer";
import FilterSearch from "../components/FilterSearch";
import PromoSection from "../components/PromoSection";
import { DrawerFilterContext } from "../context/DrawerContext";
import { SearchFilterContext } from "../context/SearchFilterContext";
import { useFetchData } from "../hooks/useFetchData";

function ProductPage() {
  // fetch data menu
  const { data: dataMenu, isLoading, error } = useFetchData("/data/menu.json");
  // state list menu yang sudah di filter
  const [filteredMenu, setFilteredMenu] = useState([]);
  // inisialisasi search params untuk filter
  const [searchParams] = useSearchParams();

  // handle drawer
  const [showDrawer, setShowDrawer] = useState(false);

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
    <SearchFilterContext value={{ searchFilter, setSearchFilter }}>
      <DrawerFilterContext.Provider value={{ showDrawer, setShowDrawer }}>
        <div className="flex flex-col gap-10 mb-20 mt-13 md:mt-20">
          {/* Filter Search on Mobile */}
          <div className="flex items-center justify-center flex-1 gap-4 px-8 pb-3 mt-5 border-b border-b-[#E8E8E8] md:hidden">
            <FilterSearch isMobile={true} />
          </div>
          {/* drawer filter search mobile */}
          <Drawer
            drawerCtx={{ showDrawer, setShowDrawer }}
            bg="bg-[#0B0909]"
            textColor="text-white">
            <FilterSearch />
          </Drawer>
          {/* hero section */}
          <div className="hidden md:block px-20 py-20 bg-[url('/img/img-header-product.png')] font-medium text-white text-5xl bg-no-repeat bg-cover bg-center">
            We Provide Good Coffee and Healthy Meals
          </div>
          {/* promo section */}
          <div>
            <PromoSection />
          </div>
          <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
            <h1 className="text-2xl font-medium sm:text-3xl md:text-4xl lg:text-5xl">
              Our <span className="text-[#8E6447]">Product</span>
            </h1>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5">
              {/* form filter dekstop */}
              <div className="hidden md:block rounded-xl bg-[#0B0909] text-white p-10 h-max">
                <FilterSearch />
              </div>
              {/* list menu */}
              <div className="flex flex-col gap-10">
                {filteredMenu.length === 0 ? (
                  <div className="content-center h-full py-10 text-gray-500 justify-items-center">
                    <p className="text-xl">Menu data not found</p>
                    <p className="mt-2">Check the filters you applied!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-5">
                    {currentData.map((menu) => (
                      <Link key={menu.id} to={`/product/${menu.id}`}>
                        <CardMenu dataMenu={menu} />
                      </Link>
                    ))}
                  </div>
                )}
                {/* pagination list menu */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="size-10 rounded-full bg-[#E8E8E8] text-black flex items-center justify-center hover:bg-gray-200 transition">
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
                      }`}>
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={handleNext}
                    className="size-10 rounded-full bg-[#FF8906] text-white flex items-center justify-center hover:bg-[#e67a05] transition">
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerFilterContext.Provider>
    </SearchFilterContext>
  );
}

export default ProductPage;
