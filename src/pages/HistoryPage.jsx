import { useContext, useEffect, useState } from "react";
import Button from "../components/Button";
import CardHistory from "../components/CardHistory";
import { AuthContext } from "../context/AuthContext";
import { useFetchData } from "../hooks/useFetchData";

function HistoryPage() {
  const { accessToken } = useContext(AuthContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(1);
  const [dateFilter, setDateFilter] = useState("");
  const limit = 5;

  const statusMapping = {
    "On Progress": 1,
    "Sending Goods": 2,
    "Finish Order": 3,
  };

  const buildURL = () => {
    const baseURL = import.meta.env.VITE_BASE_URL + "/histories";
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: limit.toString(),
      statusid: statusFilter.toString(),
    });

    if (dateFilter) {
      params.append("date", dateFilter);
    }

    return `${baseURL}?${params.toString()}`;
  };

  const {
    data: response = {},
    isLoading,
    error,
    refetch,
  } = useFetchData(buildURL(), accessToken);

  const dataHistories = response.data || [];
  const meta = response.meta || {};
  const totalPages = meta.totalPages || 1;

  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [currentPage, statusFilter, dateFilter, refetch]);

  // handle status change
  const handleStatusChange = (statusName) => {
    const statusId = statusMapping[statusName];
    setStatusFilter(statusId);
    setCurrentPage(1);
  };

  // handle date change
  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  return (
    <div className="px-4 py-10 mt-20 sm:px-6 md:px-10 lg:px-16 xl:px-20">
      <div className="flex items-center gap-10 mb-10">
        <h1 className="font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#0B0909]">
          History Order
        </h1>
        <span className="px-2 text-xs md:text-base md:px-3 md:py-1 py-1 bg-[#E8E8E8]">
          {meta.totalData || 0}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-start justify-between gap-5 md:items-center md:gap-0 md:flex-row">
            {/* status Filter */}
            <div className="py-2 order-2 md:order-1 px-5 w-full md:w-max bg-[#E8E8E899]">
              <ul className="flex justify-around text-xs sm:text-sm md:text-base md:justify-start">
                <li className={`${statusFilter === 1 && "bg-white"} p-3`}>
                  <button
                    className="cursor-pointer"
                    onClick={() => handleStatusChange("On Progress")}>
                    On Progress
                  </button>
                </li>
                <li className={`${statusFilter === 2 && "bg-white"} p-3`}>
                  <button
                    className="cursor-pointer"
                    onClick={() => handleStatusChange("Sending Goods")}>
                    Sending Goods
                  </button>
                </li>
                <li className={`${statusFilter === 3 && "bg-white"} p-3`}>
                  <button
                    className="cursor-pointer"
                    onClick={() => handleStatusChange("Finish Order")}>
                    Finish Order
                  </button>
                </li>
              </ul>
            </div>
            {/* date Filter */}
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
                  onChange={handleDateChange}
                  type="date"
                  name="dateSorting"
                  id="dateSorting"
                  value={dateFilter}
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
          {/* history List */}
          <div className="grid grid-rows-[1fr_auto] gap-10">
            {dataHistories.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                <p className="text-xl">No history found</p>
              </div>
            ) : (
              dataHistories.map((history) => (
                <CardHistory key={history.id} dataHistory={history} />
              ))
            )}
            {/* pagination */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="size-8 sm:size-10 rounded-full bg-[#E8E8E8] text-black flex items-center justify-center hover:bg-gray-200 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
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
                disabled={currentPage === totalPages}
                className="size-8 sm:size-10 rounded-full bg-[#FF8906] text-white flex items-center justify-center hover:bg-[#e67a05] transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                →
              </button>
            </div>
            {/* pagination Info */}
            <div className="text-center text-sm text-gray-600">
              Showing {dataHistories.length} of {meta.totalData} results (Page{" "}
              {currentPage} of {totalPages})
            </div>
          </div>
        </div>
        {/* message Section */}
        <div className="flex flex-col gap-3 border p-5 border-[#E8E8E8] h-max">
          <div>
            <img src="/icon/icon-message.svg" alt="Icon Message" />
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
