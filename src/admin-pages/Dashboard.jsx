import moment from "moment";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DatePicker from "react-multi-date-picker";
import { useFetchData } from "../hooks/useFetchData";

function Dashboard() {
  const { data, isLoading, error } = useFetchData("/data/order-report.json");
  const [dateRange, setDateRange] = useState([
    moment().toDate(),
    moment().add(7, "days").toDate(),
  ]);
  const [listDateRange, setListDateRange] = useState([]);

  const formatDateRange = () => {
    if (!dateRange || dateRange.length !== 2) {
      return "Select range dates";
    }

    const startDate = moment(dateRange[0]);
    const endDate = moment(dateRange[1]);

    const startDay = startDate.format("D");
    const endDay = endDate.format("D");
    const month = startDate.format("MMMM");
    const year = startDate.format("YYYY");

    return `${startDay} - ${endDay} ${month} ${year}`;
  };

  useEffect(() => {
    // Generate 7 hari dari tanggal awal
    const generateChartDates = () => {
      if (!dateRange || dateRange.length !== 2) {
        // fallback ke default
        const startDate = moment();
        const dates = [];
        for (let i = 0; i < 7; i++) {
          dates.push(startDate.clone().add(i, "days").format("D MMM"));
        }
        return dates;
      }

      const startDate = moment(dateRange[0]);
      const endDate = moment(dateRange[1]);
      const daysDiff = endDate.diff(startDate, "days") + 1;
      const dates = [];

      // Generate tanggal sesuai range yang dipilih (max 7 hari)
      const daysToShow = Math.min(daysDiff, 7);
      for (let i = 0; i < daysToShow; i++) {
        dates.push(startDate.clone().add(i, "days").format("D MMM"));
      }

      return dates;
    };
    setListDateRange(generateChartDates());
  }, [dateRange]);

  // ApexCharts Configuration
  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#22c55e"],
    },
    fill: {
      colors: ["#00A700"],
    },
    xaxis: {
      categories: listDateRange,
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "12px",
        },
        formatter: function (value) {
          return value + "c";
        },
      },
      min: 0,
      max: 300,
      tickAmount: 6,
    },
    grid: {
      borderColor: "#f3f4f6",
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      theme: "light",
      x: {
        show: true,
      },
      y: {
        formatter: function (value) {
          return value + " cups";
        },
      },
    },
  };

  const chartSeries = [
    {
      name: "Penjualan",
      data: [100, 110, 140, 150, 165, 195, 210],
    },
  ];

  // handle loading and error fetching data menu
  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;
  return (
    <>
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Order On Progress */}
        <div className="bg-[#6FC276] rounded-md p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
              <img
                className="size-6"
                src="/icon/icon-glass-orange.svg"
                alt="Icon On Progess"
              />
            </div>
            <span className="font-medium">Order On Progress</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-3xl font-bold">200</div>
            <div className="flex items-center gap-1 text-sm">
              <span>+11.01%</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Order Shipping */}
        <div className="bg-[#6C69D4] rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
              <img
                className="size-6"
                src="/icon/icon-truck.svg"
                alt="Icon Order Shipping"
              />
            </div>
            <span className="font-medium">Order Shipping</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-3xl font-bold">100</div>
            <div className="flex items-center gap-1 text-sm">
              <span>+4.01%</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Order Done */}
        <div className="bg-[#C56FBC] rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
              <img
                className="size-6"
                src="/icon/icon-profile-check.svg"
                alt="Icon Order Done"
              />
            </div>
            <span className="font-medium">Order Done</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-3xl font-bold">50</div>
            <div className="flex items-center gap-1 text-sm">
              <span>+2.01%</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6 mb-8 bg-white shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Total Penjualan
            </h2>
            <p className="text-sm text-gray-500">
              1000 cup {formatDateRange()}
            </p>
          </div>
          {/* DatePicker with custom styling */}
          <div className="date-picker-wrapper">
            <DatePicker
              value={dateRange}
              onChange={(dates) => {
                if (dates && dates.length === 2) {
                  setDateRange([dates[0].toDate(), dates[1].toDate()]);
                }
              }}
              range
              rangeHover
              format="DD MMMM YYYY"
              containerClassName="custom-container"
              inputClass="custom-input"
              className="custom-calendar"
              render={(value, openCalendar) => {
                return (
                  <button
                    onClick={openCalendar}
                    className="flex items-center gap-2 px-4 py-2 text-sm transition border border-gray-300 rounded-lg hover:bg-gray-50">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-gray-700">{formatDateRange()}</span>
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                );
              }}
            />
          </div>
        </div>

        {/* ApexCharts */}
        <div className="w-full">
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={300}
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="p-6 bg-white rounded-md shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Produk Terlaris
          </h2>
          <DatePicker
            value={dateRange}
            onChange={setDateRange}
            range
            rangeHover
            format="DD MMMM YYYY"
            containerClassName="custom-container"
            inputClass="custom-input"
            className="custom-calendar"
            render={(value, openCalendar) => {
              return (
                <button
                  onClick={openCalendar}
                  className="flex items-center gap-2 px-4 py-2 text-sm transition border border-gray-300 rounded-lg hover:bg-gray-50">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-700">{formatDateRange()}</span>
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              );
            }}
          />
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-sm font-medium text-left text-gray-600">
                  No
                </th>
                <th className="px-4 py-3 text-sm font-medium text-left text-gray-600">
                  Nama Produk
                </th>
                <th className="px-4 py-3 text-sm font-medium text-left text-gray-600">
                  Terjual
                </th>
                <th className="px-4 py-3 text-sm font-medium text-left text-gray-600">
                  Keuntungan
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((product, index) => (
                <tr
                  key={product.no}
                  className={index % 2 === 0 && "bg-[#E8E8E84D]"}>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {product.no}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    {product.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {product.sold}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-green-600">
                    IDR {product.revenue.toLocaleString("id")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
