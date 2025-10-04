import Button from "../components/Button";

function HomePage() {
  return (
    <main>
      <div className="flex">
        {/* sebelah kiri */}
        <div className="flex-1 flex flex-col">
          {/* konten atas */}
          <div className="bg-custom-gradient justify-items-center px-20 content-center h-screen">
            <div className="flex gap-5 flex-col">
              <h1 className="font-medium text-5xl text-white">
                Start Your Day with Coffe and Good Meals
              </h1>
              <p className="text-white">
                We provide high quality beans, good taste, and healthy meals
                made by love just for you. Start your day with us for a bigger
                smile!
              </p>
              <Button className="bg-[#FF8906] w-max px-10 py-4">
                Get Started
              </Button>
              <div className="flex mt-5 gap-10">
                <div className="flex-1 pr-10 border-r border-r-white">
                  <div className="font-medium text-5xl text-[#FF8906] mb-5">
                    90+
                  </div>
                  <span className="text-white">Staff</span>
                </div>
                <div className="flex-1 pr-10 border-r border-r-white">
                  <div className="font-medium text-5xl text-[#FF8906] mb-5">
                    30+
                  </div>
                  <span className="text-white">Stores</span>
                </div>
                <div className="flex-1 pr-10">
                  <div className="font-medium text-5xl text-[#FF8906] mb-5">
                    800+
                  </div>
                  <span className="text-white">Customer</span>
                </div>
              </div>
            </div>
          </div>
          {/* konten bawah */}
          <div className="flex-1 flex flex-col gap-5 px-20 justify-center">
            <div className="flex items-center">
              <div className="border-l-6 border-[#FF8906] w-1 h-15"></div>
              <div className="font-medium text-5xl p-5">
                We Provide <span className="text-[#8E6447]">Good Coffee</span>{" "}
                and <span className="text-[#8E6447]">Healthy Meals</span>
              </div>
            </div>
            <p className="text-[#4F5665]">
              You can explore the menu that we provide with fun and have their
              own taste and make your day better.
            </p>
            <div className="flex flex-col gap-10 text-[#4F5665]">
              <div className="flex gap-5">
                <img
                  src="/public/icon/icon-checklist.svg"
                  alt="Icon Checklist"
                />
                <p>High quality beans</p>
              </div>
              <div className="flex gap-5">
                <img
                  src="/public/icon/icon-checklist.svg"
                  alt="Icon Checklist"
                />
                <p>Healthy meals, you can request the ingredients</p>
              </div>
              <div className="flex gap-5">
                <img
                  src="/public/icon/icon-checklist.svg"
                  alt="Icon Checklist"
                />
                <p>Chat with our staff to get better experience for ordering</p>
              </div>
              <div className="flex gap-5">
                <img
                  src="/public/icon/icon-checklist.svg"
                  alt="Icon Checklist"
                />
                <p>Free member card with a minimum purchase of IDR 200.000.</p>
              </div>
            </div>
          </div>
        </div>
        {/* sebelah kanan */}
        <div className="flex-1 flex flex-col">
          {/* gambar atas */}
          <div className="h-screen">
            <img
              className="h-full w-full object-cover"
              src="/public/img/img-homepage.png"
              alt="Image Homepage"
            />
          </div>
          {/* gambar bawah */}
          <div className="flex-1">
            <img
              className="w-full h-full object-cover"
              src="/public/img/img-homepage2.png"
              alt="Image Homepage"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
