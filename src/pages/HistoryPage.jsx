import Button from "../components/Button";

function HistoryPage() {
  return (
    <div className="px-20 py-10 mt-20">
      <div className="flex items-center gap-10 mb-10">
        <h1 className="font-medium text-5xl text-[#0B0909]">History Order</h1>
        <span className="px-5 py-3 bg-[#E8E8E8]">1</span>
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-5">
        <div className="flex flex-col gap-10">
          <div className="flex justify-between items-center">
            <div className="p-5 bg-[#E8E8E899]">
              <ul className="flex">
                <li className="bg-white p-3">
                  <button>On Progress</button>
                </li>
                <li className="bg-white p-3">
                  <button>Sending Goods</button>
                </li>
                <li className="bg-white p-3">
                  <button>Finish Order</button>
                </li>
              </ul>
            </div>
            <div className="p-5 bg-[#E8E8E899] min-w-40 text-center">
              sorting
            </div>
          </div>
          <div className="grid grid-cols-5">
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div>1</div>
          <h2>Send Us Message</h2>
          <p>
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
