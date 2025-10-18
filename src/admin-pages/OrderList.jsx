import { useContext, useState } from "react";
import Drawer from "../components/Drawer";
import OrderDetail from "../components/OrderDetail";
import { DrawerAdminContext } from "../context/DrawerContext";
import { useFetchData } from "../hooks/useFetchData";

function OrderList() {
  const { data: orders, isLoading, error } = useFetchData("/data/order.json");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const drawerCtx = useContext(DrawerAdminContext);

  // Handler untuk Edit Product
  const handleDetailOrder = (order) => {
    setSelectedOrder(order);
    drawerCtx.setShowDrawer(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-red-100 text-red-700";
      case "On Progress":
        return "bg-orange-100 text-orange-700";
      case "Waiting":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <Drawer
        drawerCtx={drawerCtx}
        bg="bg-white"
        textColor="text-[#0B132A]"
        direction="right"
        width="w-120">
        <OrderDetail order={selectedOrder} />
      </Drawer>

      <h1 className="mb-6 text-3xl font-semibold">Order List</h1>
      {/* Header Actions */}
      <div className="flex items-end justify-between mb-6">
        <button className="flex items-center gap-2 bg-[#FF8906] px-6 py-3 rounded-lg hover:bg-[#e57a05] transition">
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
          Add Order
        </button>

        <div className="flex items-end gap-3">
          <div>
            <label className="block mb-2 text-sm text-gray-600">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8906] bg-white">
              <option>All</option>
              <option>Done</option>
              <option>Pending</option>
              <option>On Progress</option>
              <option>Waiting</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">
              Search Order
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Order Number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8906]"
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
                No. Order
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Order
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Total
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.noOrder}
                className={index % 2 === 0 && "bg-[#E8E8E84D]"}>
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  {order.noOrder}
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  {order.dateOrder}
                </td>
                <td className="px-4 py-4">
                  <ul className="text-sm text-gray-800">
                    {order.listOrders.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                        {item.name} {item.size || ""} {item.quantity}x
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  {order.total}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDetailOrder(order)}
                      className="p-2 bg-[#8E64471A] transition rounded-full hover:bg-blue-50">
                      <img
                        className="size-5"
                        src="/icon/icon-union.svg"
                        alt="Icon Union"
                      />
                    </button>
                    <button className="p-2 cursor-pointer bg-[#FF89061A] hover:bg-yellow-50 rounded-full transition">
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
          <div className="text-sm text-gray-600">Show 5 Order of 100 order</div>
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

export default OrderList;
