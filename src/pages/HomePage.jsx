import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import CardMenu from "../components/CardMenu";
import Chat from "../components/Chat";
import Testimoni from "../components/Testimoni";
import { useFetchData } from "../hooks/useFetchData";

function HomePage() {
  const { data, isLoading, error } = useFetchData("/data/menu.json");
  const [showChat, setShowChat] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;
  return (
    <div className="relative">
      {/* section 1 */}
      <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2">
        {/* konten atas */}
        <div className="content-center order-2 px-4 py-20 md:py-0 h-max md:h-screen md:order-1 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-custom-gradient justify-items-center">
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl font-medium text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Start Your Day with Coffe and Good Meals
            </h1>
            <p className="text-white">
              We provide high quality beans, good taste, and healthy meals made
              by love just for you. Start your day with us for a bigger smile!
            </p>
            <Button className="bg-[#FF8906] w-max px-5 py-2 sm:py-4 sm:px-10">
              Get Started
            </Button>
            <div className="flex gap-10 mt-5">
              <div className="flex-1 border-r border-r-white">
                <div className="font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#FF8906] mb-5">
                  90+
                </div>
                <span className="text-white">Staff</span>
              </div>
              <div className="flex-1 border-r border-r-white">
                <div className="font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#FF8906] mb-5">
                  30+
                </div>
                <span className="text-white">Stores</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#FF8906] mb-5">
                  800+
                </div>
                <span className="text-white">Customer</span>
              </div>
            </div>
          </div>
        </div>
        {/* gambar atas */}
        <div className="order-1 h-screen md:order-2">
          <img
            className="object-cover w-full h-full"
            src="/img/img-homepage.png"
            alt="Image Homepage"
          />
        </div>
        {/* konten bawah */}
        <div className="flex flex-col justify-center flex-1 order-4 px-4 md:gap-5 md:order-3 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="flex items-center">
            <div className="bg-[#FF8906] w-2 h-15"></div>
            <div className="p-5 text-2xl font-medium sm:text-3xl md:text-4xl lg:text-5xl">
              We Provide <span className="text-[#8E6447]">Good Coffee</span> and{" "}
              <span className="text-[#8E6447]">Healthy Meals</span>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-[#4F5665]">
              You can explore the menu that we provide with fun and have their
              own taste and make your day better.
            </p>
            <div className="flex flex-col gap-10 text-[#4F5665]">
              <div className="flex gap-5">
                <img src="/icon/icon-checklist.svg" alt="Icon Checklist" />
                <p>High quality beans</p>
              </div>
              <div className="flex gap-5">
                <img src="/icon/icon-checklist.svg" alt="Icon Checklist" />
                <p>Healthy meals, you can request the ingredients</p>
              </div>
              <div className="flex gap-5">
                <img src="/icon/icon-checklist.svg" alt="Icon Checklist" />
                <p>Chat with our staff to get better experience for ordering</p>
              </div>
              <div className="flex gap-5">
                <img src="/icon/icon-checklist.svg" alt="Icon Checklist" />
                <p>Free member card with a minimum purchase of IDR 200.000.</p>
              </div>
            </div>
          </div>
        </div>
        {/* gambar bawah */}
        <div className="order-3 md:order-4">
          <img
            className="object-cover w-full h-full"
            src="/img/img-homepage2.png"
            alt="Image Homepage"
          />
        </div>
      </div>
      {/* section 2 */}
      <div className="flex flex-col gap-10 px-4 mt-20 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="flex flex-col items-center gap-5">
          <h1 className="text-2xl font-medium sm:text-3xl md:text-4xl lg:text-5xl">
            Here is People's <span className="text-[#8E6447]">Favorite</span>
          </h1>
          <div className="h-2 w-20 bg-[#FF8906]"></div>
          <p className="text-[#4F5665]">
            Let's choose and have a bit taste of poeple's favorite. It might be
            yours too!
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {data.slice(0, 4).map((menu) => (
            <Link key={menu.id} to={`/product/${menu.id}`}>
              <CardMenu dataMenu={menu} />
            </Link>
          ))}
        </div>
      </div>
      {/* section 3 */}
      <div className="flex flex-col gap-10 mt-20 bg-[#E8E8E84D] py-10 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="flex flex-col items-center gap-5">
          <h1 className="text-2xl font-medium sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="text-[#8E6447]">Visit Our Store</span> in the Spot
            on the Map Below
          </h1>
          <div className="h-2 w-20 bg-[#FF8906]"></div>
          <p className="text-[#4F5665]">
            Let's choose and have a bit taste of poeple's favorite. It might be
            yours too!
          </p>
        </div>
        <div className="mt-20">
          <img src="/icon/map.svg" alt="Map Store" />
        </div>
      </div>
      {/* section 4 */}
      <div className="px-4 py-10 mb-20 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-custom-gradient">
        <Testimoni />
      </div>
      <div className="fixed bottom-125 right-107 z-100">
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed z-100 cursor-pointer bottom-5 right-5 w-16 h-16 p-2 bg-[#FF8906] rounded-full">
          <img
            className="size-full"
            src="/public/icon/icon-chat.svg"
            alt="Icon Chat"
          />
        </button>
        <Chat isShow={showChat} />
      </div>
    </div>
  );
}

export default HomePage;
