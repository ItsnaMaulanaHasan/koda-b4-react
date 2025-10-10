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

  if (!history) return <div className="mt-20 p-20">Loading...</div>;

  return (
    <div className="mt-20 p-20">
      <h1 className="font-medium text-4xl mb-5">
        Order <span className="font-bold">{history.noOrder}</span>
      </h1>
      <p className="text-sm text-[#4F5665]">
        {moment(history.dateOrder).format("DD MMMM YYYY [at] hh:mm A")}
      </p>
      <div className="grid grid-cols-2 mt-10 gap-5">
        <div>
          <h1 className="text-2xl font-medium">Order Information</h1>
          <div className="flex flex-col">
            <div className="px-3 py-5 flex justify-between items-center">
              <div className="flex items-center gap-3 font-medium text-[#4F5665]">
                <img
                  className="size-4"
                  src="/icon/icon-profile.svg"
                  alt="Icon Fullname"
                />
                <span>Full Name</span>
              </div>
              <div className="font-bold text-[#0B132A]">{history.fullName}</div>
            </div>
            <div className="px-3 py-5 flex justify-between items-center">
              <div className="flex items-center gap-3 font-medium text-[#4F5665]">
                <img
                  className="size-4"
                  src="/icon/icon-location.svg"
                  alt="Icon Location"
                />
                <span>Address</span>
              </div>
              <div className="font-bold text-[#0B132A]">{history.address}</div>
            </div>
            <div className="px-3 py-5 flex justify-between items-center">
              <div className="flex items-center gap-3 font-medium text-[#4F5665]">
                <img
                  className="size-4"
                  src="/icon/icon-phone.svg"
                  alt="Icon Phone"
                />
                <span>Phone</span>
              </div>
              <div className="font-bold text-[#0B132A]">{history.phone}</div>
            </div>
            <div className="px-3 py-5 flex justify-between items-center">
              <div className="flex items-center gap-3 font-medium text-[#4F5665]">
                <img
                  className="size-4"
                  src="/icon/icon-payment.svg"
                  alt="Icon Payment"
                />
                <span>Payment Method</span>
              </div>
              <div className="font-bold text-[#0B132A]">
                {history.paymentMethod}
              </div>
            </div>
            <div className="px-3 py-5 flex justify-between items-center">
              <div className="flex items-center gap-3 font-medium text-[#4F5665]">
                <img
                  className="size-4"
                  src="/icon/icon-shipping.svg"
                  alt="Icon Shipping"
                />
                <span>Shipping</span>
              </div>
              <div className="font-bold text-[#0B132A]">{history.shipping}</div>
            </div>
            <div className="px-3 py-5 flex justify-between items-center">
              <div className="flex items-center gap-3 font-medium text-[#4F5665]">
                <img
                  className="size-4"
                  src="/icon/icon-status.svg"
                  alt="Icon Status"
                />
                <span>Status</span>
              </div>
              <div className="font-bold text-[#0B132A]">{history.status}</div>
            </div>
            <div className="px-3 py-5 flex justify-between items-center">
              <div className="font-medium text-[#4F5665]">
                Total Transaction
              </div>
              <div className="font-bold text-[#FF8906]">
                Idr. {history.totalTransaction}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-medium">Your Order</h1>
          {history.listOrders.map((item) => (
            <CardOrder key={item.cartId} order={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailHistory;
