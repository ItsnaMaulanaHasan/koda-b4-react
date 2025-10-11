import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CardOrder from "../components/CardOrder";

function DetailHistory() {
  const { noOrder } = useParams();
  const [history, setHistory] = useState(null);
  const dataOrders = useSelector((state) => state.order.dataOrders);

  useEffect(() => {
    const data = dataOrders.find((order) => order.noOrder === noOrder);
    setHistory(data);
  }, [dataOrders, noOrder]);

  if (!history) return <div className="p-20 mt-20">Loading...</div>;

  return (
    <div className="p-4 mt-20 sm:p-6 md:p-10 lg:p-16 xl:p-20">
      <h1 className="mb-3 text-2xl font-medium sm:mb-4 sm:text-3xl md:mb-5 md:text-4xl">
        Order <span className="font-bold">{history.noOrder}</span>
      </h1>
      <p className="text-xs text-[#4F5665] sm:text-sm">
        {moment(history.dateOrder).format("DD MMMM YYYY [at] hh:mm A")}
      </p>
      <div className="grid grid-cols-1 gap-5 mt-6 sm:mt-8 md:mt-10 md:grid-cols-2 lg:gap-8">
        <div>
          <h1 className="mb-4 text-xl font-medium sm:text-2xl">
            Order Information
          </h1>
          <div className="flex flex-col bg-white">
            <div className="flex items-center justify-between px-3 py-4 border-b sm:px-4 sm:py-5 border-b-[#E8E8E8E8]">
              <div className="flex items-center gap-2 font-medium sm:gap-3 text-[#4F5665] text-xs sm:text-sm">
                <img
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  src="/icon/icon-profile.svg"
                  alt="Icon Fullname"
                />
                <span>Full Name</span>
              </div>
              <div className="font-bold text-[#0B132A] text-xs sm:text-sm md:text-base">
                {history.fullName}
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-4 border-b sm:px-4 sm:py-5 border-b-[#E8E8E8E8]">
              <div className="flex items-center gap-2 font-medium sm:gap-3 text-[#4F5665] text-xs sm:text-sm">
                <img
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  src="/icon/icon-location.svg"
                  alt="Icon Location"
                />
                <span>Address</span>
              </div>
              <div className="font-bold text-[#0B132A] text-xs sm:text-sm md:text-base text-right max-w-[60%] break-words">
                {history.address}
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-4 border-b sm:px-4 sm:py-5 border-b-[#E8E8E8E8]">
              <div className="flex items-center gap-2 font-medium sm:gap-3 text-[#4F5665] text-xs sm:text-sm">
                <img
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  src="/icon/icon-phone.svg"
                  alt="Icon Phone"
                />
                <span>Phone</span>
              </div>
              <div className="font-bold text-[#0B132A] text-xs sm:text-sm md:text-base">
                {history.phone}
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-4 border-b sm:px-4 sm:py-5 border-b-[#E8E8E8E8]">
              <div className="flex items-center gap-2 font-medium sm:gap-3 text-[#4F5665] text-xs sm:text-sm">
                <img
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  src="/icon/icon-payment.svg"
                  alt="Icon Payment"
                />
                <span>Payment Method</span>
              </div>
              <div className="font-bold text-[#0B132A] text-xs sm:text-sm md:text-base">
                {history.paymentMethod}
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-4 border-b sm:px-4 sm:py-5 border-b-[#E8E8E8E8]">
              <div className="flex items-center gap-2 font-medium sm:gap-3 text-[#4F5665] text-xs sm:text-sm">
                <img
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  src="/icon/icon-shipping.svg"
                  alt="Icon Shipping"
                />
                <span>Shipping</span>
              </div>
              <div className="font-bold text-[#0B132A] text-xs sm:text-sm md:text-base">
                {history.shipping}
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-4 border-b sm:px-4 sm:py-5 border-b-[#E8E8E8E8]">
              <div className="flex items-center gap-2 font-medium sm:gap-3 text-[#4F5665] text-xs sm:text-sm">
                <img
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  src="/icon/icon-status.svg"
                  alt="Icon Status"
                />
                <span>Status</span>
              </div>
              <div className="font-bold text-[#0B132A] text-xs sm:text-sm md:text-base">
                {history.status}
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-4 sm:px-4 sm:py-5">
              <div className="font-medium text-[#4F5665] text-xs sm:text-sm">
                Total Transaction
              </div>
              <div className="font-bold text-[#FF8906] text-sm sm:text-base md:text-lg">
                Idr. {history.totalTransaction}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:gap-4">
          <h1 className="text-xl font-medium sm:text-2xl">Your Order</h1>
          {history.listOrders.map((item) => (
            <CardOrder key={item.cartId} order={item} remove={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailHistory;
