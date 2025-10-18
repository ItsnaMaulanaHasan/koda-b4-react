import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Drawer from "../components/Drawer";
import Input from "../components/Input";
import ProductForm from "../components/ProductForm";
import { DrawerAdminContext } from "../context/DrawerContext";
import { useFetchData } from "../hooks/useFetchData";

function ProductList() {
  const { data: products, isLoading, error } = useFetchData("/data/menu.json");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredMenu, setFilteredMenu] = useState([]);

  const [formMode, setFormMode] = useState("add");
  const drawerCtx = useContext(DrawerAdminContext);

  useEffect(() => {
    if (!products) return;
    setFilteredMenu(products);
  }, [products]);

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

  const { register, handleSubmit } = useForm();

  const onSearch = (data) => {
    setFilteredMenu(
      products.filter((menu) => {
        const matchSearch =
          !data.search ||
          menu.name.toLowerCase().includes(data.search.toLowerCase());

        return matchSearch;
      })
    );
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

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;
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

        <div className="flex items-center gap-3">
          <form onChange={handleSubmit(onSearch)}>
            <Input
              {...register("search")}
              id="search"
              type="search"
              label="Search Product"
              placeholder="Find Product"
            />
          </form>

          <div className="mt-7">
            <button className="flex items-center gap-2 bg-[#FF8906] px-6 py-2 rounded-lg hover:bg-[#e57a05] transition">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-5 overflow-hidden bg-white rounded-md shadow-sm">
        <table className="w-full">
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
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Desc
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Product Size
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Method
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Stock
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((product, index) => (
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
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-12 h-12 rounded-lg"
                  />
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  {product.name}
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  {product.price}
                </td>
                <td className="max-w-xs px-4 py-4 text-sm text-gray-600 truncate">
                  {product.description}
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  {product.size}
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  {product.method}
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  {product.stock}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 cursor-pointer bg-[#FF89061A] hover:bg-yellow-50 rounded-full transition">
                      <img
                        className="size-5"
                        src="/icon/icon-edit.svg"
                        alt="Icon Edit"
                      />
                    </button>
                    <button className="p-2 cursor-pointer bg-[#D000001A] hover:bg-red-50 rounded-full transition">
                      <img
                        className="size-5"
                        src="/icon/icon-delete.svg"
                        alt="Icon Delete"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Show 5 product of 100 product
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100">
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => goToPage(index + 1)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === index + 1
                    ? "text-[#FF8906]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}>
                {index + 1}
              </button>
            ))}
            <button
              onClick={handleNext}
              className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
