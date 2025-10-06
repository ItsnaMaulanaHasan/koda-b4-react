import moment from "moment";

function CardHistory({ dataHistory }) {
  const getStatusStyle = (status) => {
    const styles = {
      "On Progress": "bg-[#FFEED9] text-[#FF8906]",
      "Sending Goods": "bg-[#D4E9FF] text-[#2196F3]",
      "Finish Order": "bg-[#D4EDDA] text-[#28A745]",
    };
    return styles[status] || "bg-gray-200 text-gray-700";
  };
  return (
    <div className="flex items-center w-full p-3 bg-[#E8E8E84D] gap-5">
      <div className="size-36">
        <img
          className="size-full"
          src={dataHistory.listOrders[0].image}
          alt={dataHistory.noOrder}
        />
      </div>
      <div className="grid w-full grid-cols-[auto_auto_auto_auto]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#4F5665]">
            <img src="/icon/icon-noorder.svg" alt="Icon No Order" />
            <span>No. Order</span>
          </div>
          <div className="font-bold">{dataHistory.noOrder}</div>
          <div>
            <a
              href={`/order-history/${dataHistory.noOrder}`}
              className="underline text-[#FF8906]"
            >
              Views Order Detail
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#4F5665]">
            <img src="/icon/icon-date.svg" alt="Icon Date" />
            <span>Date</span>
          </div>
          <div className="font-bold">
            {moment(dataHistory.dateOrder).format("DD MMMM YYYY")}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#4F5665]">
            <img src="/icon/icon-total.svg" alt="Icon Total" />
            <span>Total</span>
          </div>
          <div className="font-bold">{dataHistory.totalTransaction}</div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#4F5665]">
            <img src="/icon/icon-status.svg" alt="Icon Status" />
            <span>Status</span>
          </div>
          <div
            className={`py-2 w-max px-4 font-bold rounded-full text-center text-sm ${getStatusStyle(
              dataHistory.status
            )}`}
          >
            {dataHistory.status}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardHistory;
