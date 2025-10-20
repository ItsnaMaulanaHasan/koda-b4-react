import { useContext, useState } from "react";
import { DrawerAdminContext } from "../context/DrawerContext";
import CardOrder from "./CardOrder";

// const order = {
//   orderNo: "#12354-09893",
//   customerName: "Ghaluh Wizard Anggoro",
//   address: "Griya bandung indah",
//   phone: "082116304338",
//   paymentMethod: "Cash",
//   shipping: "Dine In",
//   total: "Idr 80.000",
//   items: [
//     {
//       menuId: 1,
//       name: "Hazelnut Latte",
//       image: "/img-menus/image1.png",
//       price: 20000,
//       originalPrize: 40000,
//       size: "Regular",
//       hotIce: "Ice",
//       quantity: 2,
//       isFlashSale: false,
//     },
//     {
//       menuId: 2,
//       name: "Hazelnut Latte",
//       image: "/img-menus/image1.png",
//       price: 20000,
//       originalPrize: 40000,
//       size: "Regular",
//       hotIce: "Ice",
//       quantity: 2,
//       isFlashSale: true,
//     },
//   ],
// };

const OrderDetail = ({ order }) => {
  const { setShowDrawer } = useContext(DrawerAdminContext);
  const [status, setStatus] = useState(order?.status || "Pending");

  if (!order) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No order selected</p>
      </div>
    );
  }

  const handleUpdate = () => {
    console.log("Update Order:", {
      ...order,
      status: status,
    });
    alert("Order updated successfully!");
    setShowDrawer(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-6 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Order {order.orderNo}</h1>
          <button
            onClick={() => setShowDrawer(false)}
            className="flex items-center justify-center w-8 h-8 text-red-500 transition border-2 border-red-500 rounded-full hover:bg-red-50">
            ✕
          </button>
        </div>

        {/* Order Information */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Order Information</h2>

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
                {order.customerName || "Ghaluh Wizard Anggoro"}
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
              <span className="font-medium text-gray-900">
                {order.address || "Griya bandung indah"}
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <img src="/icon/icon-phone.svg" alt="Icon Phone" />
                <span className="text-sm">Phone</span>
              </div>
              <span className="font-medium text-gray-900">
                {order.phone || "082116304338"}
              </span>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <img src="/icon/icon-payment.svg" alt="Icon Payment" />
                <span className="text-sm">Payment Method</span>
              </div>
              <span className="font-medium text-gray-900">
                {order.paymentMethod || "Cash"}
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
                {order.shipping || "Dine In"}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <img src="/icon/icon-status.svg" alt="Icon Status" />
                <span className="text-sm">Status</span>
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8906] cursor-pointer">
                <option value="Pending">Pending</option>
                <option value="Waiting">Waiting</option>
                <option value="On Progress">On Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* Total Transaksi */}
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600">Total Transaksi</span>
              <span className="text-xl font-semibold text-[#FF8906]">
                {order.total}
              </span>
            </div>
          </div>
        </div>

        {/* Your Order Section */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Your Order</h2>
          <div className="flex flex-col gap-4">
            {order.listOrders && order.listOrders.length > 0 ? (
              order.listOrders.map((item, index) => (
                <CardOrder
                  key={item.menuId || index}
                  order={item}
                  remove={false}
                />
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
          className="w-full py-3 bg-[#FF8906] text-white rounded-lg hover:bg-[#e57a05] transition font-medium mt-2">
          Update
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
