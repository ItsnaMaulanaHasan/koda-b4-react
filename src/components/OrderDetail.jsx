import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { DrawerAdminContext } from "../context/DrawerContext";
import { useFetchData } from "../hooks/useFetchData";
import Alert from "./Alert";
import CardCart from "./CardCart";

const OrderDetail = ({ orderId, onSuccess }) => {
  const { accessToken } = useContext(AuthContext);
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data: { data: order },
    isLoading,
    error,
    refetch,
  } = useFetchData(
    import.meta.env.VITE_BASE_URL + "/admin/transactions/" + orderId,
    accessToken
  );

  const { data: { data: statusList = [] } = {} } = useFetchData(
    `${import.meta.env.VITE_BASE_URL}/admin/status`,
    accessToken
  );

  const { setShowDrawer } = useContext(DrawerAdminContext);
  const [statusId, setStatusId] = useState(null);

  useEffect(() => {
    if (order?.status && statusList.length > 0 && statusId === null) {
      const matchedStatus = statusList.find(
        (status) => status.name === order.status
      );

      if (matchedStatus) {
        setStatusId(matchedStatus.id);
      }
    }
  }, [order?.status, statusList, statusId]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#5a8120] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="p-8 text-center border border-red-200 rounded-lg bg-red-50">
          <img src="/icon/icon-warning.svg" alt="Icon Warning" />
          <p className="font-medium text-red-600">Error: {error}</p>
        </div>
      </div>
    );

  if (!order)
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="p-8 text-center border border-red-200 rounded-lg bg-red-50">
          <img src="/icon/icon-warning.svg" alt="Icon Warning" />
          <p className="font-medium text-red-600">Product not found</p>
        </div>
      </div>
    );

  const handleUpdate = async () => {
    if (!statusId) {
      setAlertStatus({
        type: "error",
        message: "Please select a status",
      });
      return;
    }

    setIsUpdating(true);
    setAlertStatus({ type: "", message: "" });

    try {
      const formData = new URLSearchParams();
      formData.append("statusId", statusId.toString());

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/transactions/${orderId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setAlertStatus({
          type: "success",
          message: result.message || "Transaction status updated successfully",
        });

        setTimeout(() => {
          refetch();
          setShowDrawer(false);
          if (onSuccess) {
            onSuccess();
          }
        }, 1500);
      } else {
        setAlertStatus({
          type: "error",
          message: result.message || "Failed to update transaction status",
        });
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
      setAlertStatus({
        type: "error",
        message: "An error occurred while updating transaction status",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Alert
        type={alertStatus.type}
        message={alertStatus.message}
        onClose={() => setAlertStatus({ type: "", message: "" })}
      />
      <div className="flex flex-col flex-1 gap-6 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{order.noInvoice}</h1>
          <button
            onClick={() => setShowDrawer(false)}
            className="flex items-center justify-center w-8 h-8 text-red-500 transition border-2 border-red-500 rounded-full hover:bg-red-50">
            ✕
          </button>
        </div>

        {/* Order Information */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">
            Transaction Information
          </h2>

          <div className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <img
                  src="/icon/icon-profile.svg"
                  alt="Icon Profile"
                  className="size-5"
                />
                <span className="text-sm">Full Name</span>
              </div>
              <span className="font-medium text-gray-900">
                {order.fullName}
              </span>
            </div>

            {/* Address */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <img
                  src="/icon/icon-location.svg"
                  alt="Icon Address"
                  className="size-5"
                />
                <span className="text-sm">Address</span>
              </div>
              <span className="font-medium text-gray-900">{order.address}</span>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <img src="/icon/icon-phone.svg" alt="Icon Phone" />
                <span className="text-sm">Phone</span>
              </div>
              <span className="font-medium text-gray-900">{order.phone}</span>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <img src="/icon/icon-payment.svg" alt="Icon Payment" />
                <span className="text-sm">Payment Method</span>
              </div>
              <span className="font-medium text-gray-900">
                {order.paymentMethod}
              </span>
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <img
                  src="/icon/icon-truck-black.svg"
                  alt="Icon Shipping"
                  className="size-5"
                />
                <span className="text-sm">Shipping</span>
              </div>
              <span className="font-medium text-gray-900">
                {order.orderMethod}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <img src="/icon/icon-status.svg" alt="Icon Status" />
                <span className="text-sm">Status</span>
              </div>
              <select
                value={statusId || ""}
                onChange={(e) => setStatusId(Number(e.target.value))}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8120] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {statusList.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Transaksi */}
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600">Total Transaksi</span>
              <span className="text-xl font-semibold text-[#5a8120]">
                {order.totalTransaction}
              </span>
            </div>
          </div>
        </div>

        {/* Your Order Section */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Your Order</h2>
          <div className="flex flex-col gap-4">
            {order.transactionItems && order.transactionItems.length > 0 ? (
              order.transactionItems.map((item) => (
                <CardCart key={item.id} cart={item} remove={false} />
              ))
            ) : (
              <p className="py-4 text-center text-gray-500">
                No items in order
              </p>
            )}
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="w-full py-3 bg-[#5a8120] text-white rounded-lg hover:bg-[#b9c228] transition font-medium mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {isUpdating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Updating...</span>
            </>
          ) : (
            "Update"
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
