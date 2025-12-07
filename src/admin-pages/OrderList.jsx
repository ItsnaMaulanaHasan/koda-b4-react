import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Drawer from "../components/Drawer";
import Input from "../components/Input";
import OrderDetail from "../components/OrderDetail";
import { AuthContext } from "../context/AuthContext";
import { DrawerAdminContext } from "../context/DrawerContext";
import { useFetchData } from "../hooks/useFetchData";

function OrderList() {
  const { accessToken } = useContext(AuthContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 5;

  const { data: { data: statusList = [] } = {} } = useFetchData(
    `${import.meta.env.VITE_BASE_URL}/admin/status`,
    accessToken
  );

  const buildURL = () => {
    const params = new URLSearchParams({
      page: currentPage,
      limit: limit,
    });

    if (debouncedSearch.trim()) {
      params.append("search", debouncedSearch.trim());
    }

    if (statusFilter && statusFilter !== "") {
      params.append("status_id", statusFilter);
    }

    return `${
      import.meta.env.VITE_BASE_URL
    }/admin/transactions?${params.toString()}`;
  };

  const {
    data: response = {},
    isLoading,
    error,
    refetch,
  } = useFetchData(buildURL(), accessToken);

  const orders = response.data || [];
  const meta = response.meta || {};
  const totalPages = meta.totalPages || 1;
  const totalData = meta.totalData || 0;

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const drawerCtx = useContext(DrawerAdminContext);

  const { register, watch } = useForm();
  const searchValue = watch("search");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue || "");
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    refetch();
  }, [currentPage, debouncedSearch, statusFilter, refetch]);

  const handleDetailOrder = (id) => {
    setSelectedOrderId(id);
    drawerCtx.setShowDrawer(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Finish Order":
        return "bg-green-100 text-green-700";
      case "On Progress":
        return "bg-orange-100 text-orange-700";
      case "Sending Goods":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-[#5a8120] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 text-center border border-red-200 rounded-lg bg-red-50">
          <img src="/icon/icon-warning.svg" alt="Icon Warning" />
          <p className="font-medium text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Drawer
        drawerCtx={drawerCtx}
        bg="bg-white"
        textColor="text-[#0B132A]"
        direction="right"
        width="w-120">
        <OrderDetail orderId={selectedOrderId} onSuccess={refetch} />
      </Drawer>

      <h1 className="mb-6 text-3xl font-semibold">Order List</h1>
      {/* Header Actions */}
      <div className="flex items-end justify-end mb-6">
        {/* status filter */}
        <div className="flex items-end gap-3">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <label className="font-bold text-sm sm:text-base text-[#0B132A]">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-64 px-4 py-2 border h-11 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8120] bg-white">
              <option value="">All</option>
              {statusList.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Input
                {...register("search")}
                id="search"
                type="search"
                label="Search Transaction"
                placeholder="Search by invoice or customer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-5 overflow-hidden bg-white rounded-md shadow-sm">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                No. Invoice
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
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  {statusFilter !== ""
                    ? `No orders with selected status`
                    : debouncedSearch
                    ? "No orders found matching your search"
                    : "No orders available"}
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order.id}
                  className={index % 2 === 0 ? "bg-[#E8E8E84D]" : ""}>
                  <td className="px-4 py-4 text-sm text-center text-gray-800">
                    {order.noInvoice}
                  </td>
                  <td className="px-4 py-4 text-sm text-center text-gray-800">
                    {order.dateTransaction}
                  </td>
                  <td className="px-4 py-4">
                    <ul className="text-sm text-gray-800">
                      {order.transactionItems?.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                          {item}
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
                  <td className="px-4 py-4 text-sm text-center text-gray-800">
                    {order.total.toLocaleString("id")}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDetailOrder(order.id)}
                        className="p-2 cursor-pointer bg-[#5a81201A] hover:bg-yellow-50 rounded-full transition">
                        <img
                          className="size-5"
                          src="/icon/icon-edit.svg"
                          alt="Icon Edit"
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
            Show {orders.length} of {totalData || 0} transactions
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
                        ? "bg-[#5a8120] text-white"
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

export default OrderList;
