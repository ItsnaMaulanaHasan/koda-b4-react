import moment from "moment";

/**
 * CardHistory component for displaying order history information
 * @param {Object} props - Component props
 * @param {Object} props.dataHistory - Order history data
 * @param {string} props.dataHistory.noOrder - Order number
 * @param {Array} props.dataHistory.listOrders - List of ordered items
 * @param {string} props.dataHistory.listOrders[].image - Product image URL
 * @param {string} props.dataHistory.dateOrder - Order date
 * @param {string} props.dataHistory.totalTransaction - Total transaction amount
 * @param {'On Progress'|'Sending Goods'|'Finish Order'} props.dataHistory.status - Order status
 * @returns {JSX.Element} CardHistory component
 */
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
      <div className="hidden md:block size-36">
        <img
          className="size-full object-cover"
          src={dataHistory.image || "/img/empty-image-placeholder.webp"}
          alt={dataHistory.noInvoice}
        />
      </div>
      <div className="grid w-full grid-cols-[auto_auto] grid-rows-2 md:grid-cols-[auto_auto_auto_auto]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#4F5665]">
            <img src="/icon/icon-noorder.svg" alt="Icon No Order" />
            <span>No. Order</span>
          </div>
          <div className="font-bold">{dataHistory.noInvoice}</div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#4F5665]">
            <img src="/icon/icon-date.svg" alt="Icon Date" />
            <span>Date</span>
          </div>
          <div className="font-bold">
            {moment(dataHistory.dateTransaction).format("DD MMMM YYYY")}
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
            )}`}>
            {dataHistory.status}
          </div>
        </div>
        <div>
          <a
            href={`/order-history/${dataHistory.noInvoice}`}
            className="underline text-[#FF8906]">
            Views Order Detail
          </a>
        </div>
      </div>
    </div>
  );
}

export default CardHistory;
