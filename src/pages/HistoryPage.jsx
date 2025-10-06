import { useEffect, useState } from "react";
import Button from "../components/Button";
import { getOrderHistories } from "../utils/orderUtils";
import CardHistory from "../components/CardHistory";

function HistoryPage() {
  const [histories, setHistories] = useState([]);
  const [status, setStatus] = useState("On Progress");

  useEffect(() => {
    setHistories(getOrderHistories());
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(histories.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = histories.slice(indexOfFirstItem, indexOfLastItem);

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
    <div className="px-20 py-10 mt-20">
      <div className="flex items-center gap-10 mb-10">
        <h1 className="font-medium text-5xl text-[#0B0909]">History Order</h1>
        <span className="px-3 py-1 bg-[#E8E8E8]">{histories.length}</span>
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-5">
        <div className="flex flex-col gap-10">
          <div className="flex justify-between items-center">
            <div className="py-2 px-5 bg-[#E8E8E899]">
              <ul className="flex">
                <li className={`${status === "On Progress" && "bg-white"} p-3`}>
                  <button
                    className="cursor-pointer"
                    onClick={() => setStatus("On Progress")}
                  >
                    On Progress
                  </button>
                </li>
                <li
                  className={`${status === "Sending Goods" && "bg-white"} p-3`}
                >
                  <button
                    className="cursor-pointer"
                    onClick={() => setStatus("Sending Goods")}
                  >
                    Sending Goods
                  </button>
                </li>
                <li
                  className={`${status === "Finish Order" && "bg-white"} p-3`}
                >
                  <button
                    className="cursor-pointer"
                    onClick={() => setStatus("Finish Order")}
                  >
                    Finish Order
                  </button>
                </li>
              </ul>
            </div>
            <div className="py-2 px-5 bg-[#E8E8E899] min-w-40 flex items-center gap-2 relative">
              <label htmlFor="dateSorting">
                <img
                  src="/icon/icon-date.svg"
                  alt="Icon Date"
                  className="pointer-events-none"
                />
              </label>
              <input
                type="date"
                name="dateSorting"
                id="dateSorting"
                className="bg-transparent outline-none cursor-pointer flex-1 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
              <label htmlFor="dateSorting">
                <img
                  src="/icon/icon-dropdown.svg"
                  alt="Icon Dropdown"
                  className="pointer-events-none"
                />
              </label>
            </div>
          </div>
          <div className="grid grid-rows-[1fr_auto] gap-10">
            {currentData.map((history) => (
              <CardHistory dataHistory={history} />
            ))}
            <div className="flex justify-center items-center gap-3">
              <button
                onClick={handlePrev}
                className="size-10 rounded-full bg-[#E8E8E8] text-black flex items-center justify-center hover:bg-gray-200 transition"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => goToPage(index + 1)}
                  className={`size-10 rounded-full flex items-center justify-center transition ${
                    currentPage === index + 1
                      ? "bg-[#FF8906] text-[#0B0909]"
                      : "bg-[#E8E8E8] text-[#A0A3BD] hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={handleNext}
                className="size-10 rounded-full bg-[#FF8906] text-white flex items-center justify-center hover:bg-[#e67a05] transition"
              >
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
