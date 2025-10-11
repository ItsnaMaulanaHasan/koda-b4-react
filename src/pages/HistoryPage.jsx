import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "../components/Button";
import CardHistory from "../components/CardHistory";

function HistoryPage() {
  const dataOrders = useSelector((state) => state.order.dataOrders);
  const [filteredOrders, setFilteredOrders] = useState(dataOrders);
  const [status, setStatus] = useState("On Progress");
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    let filtered = dataOrders;

    // Filter by status
    if (status) {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter((order) => {
        const orderDate = moment(order.dateOrder).format("YYYY-MM-DD");
        return orderDate === filterDate;
      });
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [status, filterDate, dataOrders]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1));
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="px-4 py-10 mt-20 sm:px-6 md:px-10 lg:px-16 xl:px-20">
      <div className="flex items-center gap-10 mb-10">
        <h1 className="font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#0B0909]">
          History Order
        </h1>
        <span className="px-2 text-xs md:text-base md:px-3 md:py-1 py-1 bg-[#E8E8E8]">
          {dataOrders.length}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-start justify-between gap-5 md:items-center md:gap-0 md:flex-row">
            <div className="py-2 order-2 md:order-1 px-5 w-full md:w-max bg-[#E8E8E899]">
              <ul className="flex justify-around text-xs sm:text-sm md:text-base md:justify-start">
                <li className={`${status === "On Progress" && "bg-white"} p-3`}>
                  <button
                    className="cursor-pointer"
                    onClick={() => setStatus("On Progress")}>
                    On Progress
                  </button>
                </li>
                <li
                  className={`${status === "Sending Goods" && "bg-white"} p-3`}>
                  <button
                    className="cursor-pointer"
                    onClick={() => setStatus("Sending Goods")}>
                    Sending Goods
                  </button>
                </li>
                <li
                  className={`${status === "Finish Order" && "bg-white"} p-3`}>
                  <button
                    className="cursor-pointer"
                    onClick={() => setStatus("Finish Order")}>
                    Finish Order
                  </button>
                </li>
              </ul>
            </div>
            <div className="py-2 px-5 order-1 md:order-2 bg-[#E8E8E899] min-w-40 h-full content-center">
              <form className="relative flex items-center gap-2">
                <label htmlFor="dateSorting">
                  <img
                    src="/icon/icon-date.svg"
                    alt="Icon Date"
                    className="pointer-events-none"
                  />
                </label>
                <input
                  onChange={(e) => setFilterDate(e.target.value)}
                  type="date"
                  name="dateSorting"
                  id="dateSorting"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="bg-transparent outline-none cursor-pointer flex-1 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <label htmlFor="dateSorting">
                  <img
                    src="/icon/icon-dropdown.svg"
                    alt="Icon Dropdown"
                    className="pointer-events-none"
                  />
                </label>
              </form>
            </div>
          </div>
          <div className="grid grid-rows-[1fr_auto] gap-10">
            {filteredOrders.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                <p className="text-xl">Data is empty</p>
              </div>
            ) : (
              currentData.map((order) => (
                <CardHistory key={order.noOrder} dataHistory={order} />
              ))
            )}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={handlePrev}
                className="size-8 sm:size-10 rounded-full bg-[#E8E8E8] text-black flex items-center justify-center hover:bg-gray-200 transition text-sm sm:text-base">
                ←
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => goToPage(index + 1)}
                  className={`size-8 sm:size-10 rounded-full flex items-center justify-center transition text-sm sm:text-base ${
                    currentPage === index + 1
                      ? "bg-[#FF8906] text-[#0B0909]"
                      : "bg-[#E8E8E8] text-[#A0A3BD] hover:bg-gray-300"
                  }`}>
                  {index + 1}
                </button>
              ))}
              <button
                onClick={handleNext}
                className="size-8 sm:size-10 rounded-full bg-[#FF8906] text-white flex items-center justify-center hover:bg-[#e67a05] transition text-sm sm:text-base">
                →
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border p-5 border-[#E8E8E8] h-max">
          <div>
            <img src="/public/icon/icon-message.svg" alt="Icon Message" />
          </div>
          <h2 className="font-semibold text-[#4F5665] text-lg">
            Send Us Message
          </h2>
          <p className="text-[#4F5665]">
            if your unable to find answer or find your product quickly, please
            describe your problem and tell us. we will give you solution.
          </p>
          <Button className="bg-[#FF8906]">Send Message</Button>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
