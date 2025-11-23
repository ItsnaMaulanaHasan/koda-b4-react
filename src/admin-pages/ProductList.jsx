import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Drawer from "../components/Drawer";
import Input from "../components/Input";
import ProductForm from "../components/ProductForm";
import { AuthContext } from "../context/AuthContext";
import { DrawerAdminContext } from "../context/DrawerContext";
import { useFetchData } from "../hooks/useFetchData";

function ProductList() {
  const { accessToken } = useContext(AuthContext);

  // state untuk pagination dan search
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 5;

  // build url dengan query params
  const buildURL = () => {
    const params = new URLSearchParams({
      page: currentPage,
      limit: limit,
    });

    if (debouncedSearch.trim()) {
      params.append("search", debouncedSearch.trim());
    }

    return `${
      import.meta.env.VITE_BASE_URL
    }/admin/products?${params.toString()}`;
  };

  const {
    data: response = {},
    isLoading,
    error,
    refetch,
  } = useFetchData(buildURL(), accessToken);

  const products = response.data || [];
  const meta = response.meta || {};
  const totalPages = meta.totalPages || 1;
  const totalData = meta.totalData || 0;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formMode, setFormMode] = useState("add");
  const drawerCtx = useContext(DrawerAdminContext);

  const { register, watch } = useForm();
  const searchValue = watch("search");

  // debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue || "");
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // refetch when currentPage atau debouncedSearch berubah
  useEffect(() => {
    refetch();
  }, [currentPage, debouncedSearch, refetch]);

  // Handler untuk Add Product
  const handleAddProduct = () => {
    setFormMode("add");
    setSelectedProduct(null);
    drawerCtx.setShowDrawer(true);
  };

  // Handler untuk Edit Product
  const handleEditProduct = (product) => {
    setFormMode("edit");
    setSelectedProduct(product);
    drawerCtx.setShowDrawer(true);
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }
  return (
    <div className="relative p-6">
      <Drawer
        drawerCtx={drawerCtx}
        bg="bg-white"
        textColor="text-[#0B132A]"
        direction="right"
        width="w-120">
        <ProductForm mode={formMode} product={selectedProduct} />
      </Drawer>

      <h1 className="mb-6 text-3xl font-semibold">Product List</h1>

      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        {/* button add */}
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 bg-[#FF8906] px-6 py-3 rounded-lg hover:bg-[#e57a05] transition">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Product
        </button>

        {/* form search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              {...register("search")}
              id="search"
              type="search"
              label="Search Product"
              placeholder="Search by name or description"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-5 overflow-hidden bg-white rounded-md shadow-sm">
        <table className="w-full">
          {/* table header */}
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded"
                />
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Image
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Product Name
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Price
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700 w-48">
                Desc
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Sizes
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Variants
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Categories
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Stock
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          {/* table body */}
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="11"
                  className="px-4 py-8 text-center text-gray-500">
                  {debouncedSearch
                    ? "No products found matching your search"
                    : "No products available"}
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr
                  key={product.id}
                  className={index % 2 === 0 && "bg-[#E8E8E84D]"}>
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <img
                      src={
                        product.imagePrimary ||
                        "/img/empty-image-placeholder.webp"
                      }
                      alt={product.name}
                      className="object-cover w-12 h-12 rounded-lg"
                      onError={(e) => {
                        e.target.src = "/img/empty-image-placeholder.webp";
                      }}
                    />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    {product.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <div className="flex flex-col items-center">
                      {product.discountPercent > 0 ? (
                        <>
                          <span className="text-xs line-through text-gray-400">
                            {product.price.toLocaleString("id")}
                          </span>
                          <span className="font-semibold text-green-600">
                            {product.discountPrice.toLocaleString("id")}
                          </span>
                          <span className="text-xs text-red-600">
                            -{product.discountPercent}%
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold">
                          {product.price.toLocaleString("id")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    <div
                      className="w-48 max-h-20 text-left break-words line-clamp-3"
                      title={product.description}>
                      {product.description}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <div className="flex flex-wrap justify-center gap-1">
                      {product.productSizes.length > 0 ? (
                        product.productSizes.map((size, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {size}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <div className="flex flex-wrap justify-center gap-1">
                      {product.productVariants.length > 0 ? (
                        product.productVariants.map((variant, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                            {variant}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <div className="flex flex-wrap justify-center gap-1">
                      {product.productCategories.length > 0 ? (
                        product.productCategories.map((category, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                            {category}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-center">
                    <span
                      className={`px-2 py-1 rounded ${
                        product.stock > 10
                          ? "bg-green-100 text-green-800"
                          : product.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          product.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                      {product.isFlashSale && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                          Flash Sale
                        </span>
                      )}
                      {product.isFavourite && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                          ⭐ Fav
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="cursor-pointer hover:bg-yellow-50 transition">
                        <img
                          className="size-5"
                          src="/icon/icon-edit.svg"
                          alt="Icon Edit"
                        />
                      </button>
                      <button className="cursor-pointer hover:bg-red-50 transition">
                        <img
                          className="size-5"
                          src="/icon/icon-delete.svg"
                          alt="Icon Delete"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Show {products.length} product of {totalData || 0} product
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              if (
                totalPages <= 5 ||
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === pageNumber
                        ? "bg-[#FF8906] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}>
                    {pageNumber}
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
              className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
