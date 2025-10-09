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
              <div>1</div>
              <div>{history.fullName}</div>
            </div>
            <div className="px-3 py-5 flex justify-between items-center">
              <div>1</div>
              <div>{history.address}</div>
            </div>
            <div className="px-3 py-5 flex justify-between items-center">
              <div>1</div>
              <div>{history.phone}</div>
            </div>
            <div className="px-3 py-5 flex justify-between items-center">
              <div>1</div>
              <div>{history.paymentMethod}</div>
            </div>
            <div className="px-3 py-5 flex justify-between items-center">
              <div>1</div>
              <div>{history.shipping}</div>
            </div>
            <div className="px-3 py-5 flex justify-between items-center">
              <div>1</div>
              <div>{history.status}</div>
            </div>
            <div className="px-3 py-5 flex justify-between items-center">
              <div>1</div>
              <div>{history.totalTransaction}</div>
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
