import Button from "../components/Button";
import CardMenu from "../components/CardMenu";
import Testimoni from "../components/Testimoni";
import { useFetchData } from "../hooks/useFetchData";

function HomePage() {
  const { data, isLoading, error } = useFetchData("data/menu.json");

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;
  return (
    <>
      {/* section 1 */}
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
              <div className="bg-[#FF8906] w-2 h-15"></div>
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
                <img src="icon/icon-checklist.svg" alt="Icon Checklist" />
                <p>High quality beans</p>
              </div>
              <div className="flex gap-5">
                <img src="icon/icon-checklist.svg" alt="Icon Checklist" />
                <p>Healthy meals, you can request the ingredients</p>
              </div>
              <div className="flex gap-5">
                <img src="icon/icon-checklist.svg" alt="Icon Checklist" />
                <p>Chat with our staff to get better experience for ordering</p>
              </div>
              <div className="flex gap-5">
                <img src="icon/icon-checklist.svg" alt="Icon Checklist" />
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
              src="img/img-homepage.png"
              alt="Image Homepage"
            />
          </div>
          {/* gambar bawah */}
          <div className="flex-1">
            <img
              className="w-full h-full object-cover"
              src="img/img-homepage2.png"
              alt="Image Homepage"
            />
          </div>
        </div>
      </div>
      {/* section 2 */}
      <div className="flex flex-col gap-10 mt-20 px-20">
        <div className="flex flex-col gap-5 items-center">
          <h1 className="font-medium text-5xl">
            Here is People's <span className="text-[#8E6447]">Favorite</span>
          </h1>
          <div className="h-2 w-20 bg-[#FF8906]"></div>
          <p className="text-[#4F5665]">
            Let's choose and have a bit taste of poeple's favorite. It might be
            yours too!
          </p>
        </div>
        <div className="grid grid-cols-4">
          {data.slice(0, 4).map((menu) => (
            <CardMenu key={menu.id} dataMenu={menu} />
          ))}
        </div>
      </div>
      {/* section 3 */}
      <div className="flex flex-col gap-10 mt-20 bg-[#E8E8E84D] py-10 px-20">
        <div className="flex flex-col gap-5 items-center">
          <h1 className="font-medium text-5xl">
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
          <img src="icon/map.svg" alt="Map Store" />
        </div>
      </div>
      {/* section 4 */}
      <div className="bg-custom-gradient px-20 py-10 mb-20">
        <Testimoni />
      </div>
    </>
  );
}

export default HomePage;
