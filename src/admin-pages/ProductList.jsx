import { useContext, useState } from "react";
import Drawer from "../components/Drawer";
import ProductForm from "../components/ProductForm";
import { DrawerAdminContext } from "../context/DrawerContext";

const products = [
  {
    id: 1,
    image: "/img-menus/image1.png",
    name: "Caramel Machiato",
    price: 40000,
    desc: "Cold brewing is a method of brewing that...",
    size: "R,L,XL,250gr",
    method: "Deliver, Dine In",
    stock: 200,
  },
  {
    id: 2,
    image: "/img-menus/image2.png",
    name: "Hazelnut Latte",
    price: 40000,
    desc: "Cold brewing is a method of brewing that...",
    size: "R,L,XL,250gr",
    method: "Deliver, Dine In",
    stock: 200,
  },
  {
    id: 3,
    image: "/img-menus/image3.png",
    name: "Kopi Susu",
    price: 40000,
    desc: "Cold brewing is a method of brewing that...",
    size: "R,L,XL,250gr",
    method: "Dine In",
    stock: 200,
  },
  {
    id: 4,
    image: "/img-menus/image4.png",
    name: "Espresso Supreme",
    price: 40000,
    desc: "Cold brewing is a method of brewing that...",
    size: "R,L,XL,250gr",
    method: "Deliver",
    stock: 200,
  },
];

function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formMode, setFormMode] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const drawerCtx = useContext(DrawerAdminContext);

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
          <div>
            <label className="block mb-2 text-sm text-gray-600">
              Search Product
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Product Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8906]"
              />
              <svg
                className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 right-3 top-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

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
            {products.map((product, index) => (
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
                  {product.desc}
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
            <button className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100">
              Prev
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === page
                    ? "text-[#FF8906]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}>
                {page}
              </button>
            ))}
            <button className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
