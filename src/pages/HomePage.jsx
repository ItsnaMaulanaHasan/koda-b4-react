import { useState } from "react";
import { Link, ScrollRestoration, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CardMenu from "../components/CardMenu";
import Chat from "../components/Chat";
import FAQSection from "../components/FAQSection";
import Testimoni from "../components/Testimoni";
import { useFetchData } from "../hooks/useFetchData";

function HomePage() {
  const {
    data: { data: favouriteProducts },
    isLoading,
    error,
  } = useFetchData(
    import.meta.env.VITE_BASE_URL + "/favourite-products?limit=6"
  );
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#5a8120] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 text-center border border-red-200 rounded-lg bg-red-50">
          <img src="/icon/icon-warning.svg" alt="Icon Warning" />
          <p className="font-medium text-red-600">Error: {error}</p>
        </div>
      </div>
    );

  return (
    <>
      <ScrollRestoration />
      {/* section 1 */}
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
        {/* left top */}
        <div className="relative flex items-center px-6 py-16 md:py-20 lg:py-24 sm:px-10 md:px-12 lg:px-16 xl:px-20">
          {/* Decorative Leave */}
          <div className="absolute hidden top-8 left-8 md:block">
            <img
              className="h-24 lg:h-32 w-auto rotate-[30deg] opacity-80"
              src="/img/img-leafe-decoration1.png"
              alt="Decorative Leafe"
            />
          </div>

          <div className="relative z-10 flex flex-col max-w-xl gap-6">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl">
              Start Your Healthy Journey with
              <span className="text-[#5a8120]"> Fresh Green Drinks</span>
            </h1>

            <p className="text-base leading-relaxed text-gray-600 md:text-lg">
              We provide premium quality ingredients, natural flavors, and
              nutritious drinks made with care just for you. Start your wellness
              journey with us for a healthier life!
            </p>

            <div className="mt-2">
              <Button
                onClick={() => navigate("/product")}
                className="inline-flex items-center gap-2 bg-[#201E1E] text-white px-8 py-3 md:px-10 md:py-4 rounded-2xl font-semibold hover:bg-[#5a8120] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                Get Started
                <img
                  className="size-8"
                  src="/icon/icon-arrow.svg"
                  alt="Icon Arrow"
                />
              </Button>
            </div>
          </div>
        </div>

        {/* image right top */}
        <div className="relative h-[400px] md:h-[600px] lg:h-[700px] xl:h-[800px] overflow-hidden">
          <img
            className="object-cover object-center w-full h-full"
            src="/img/img-homepage1.png"
            alt="Fresh Green Drinks"
          />
        </div>

        {/* image left bottom */}
        <div className="relative flex items-center justify-center px-6 py-16 md:py-20 lg:py-24 sm:px-10 md:px-12 lg:px-16 xl:px-20">
          <div className="w-full max-w-lg">
            <img
              className="w-full h-auto transition-transform duration-500 shadow-2xl rounded-3xl hover:scale-105"
              src="/img/img-homepage2.png"
              alt="Nutrition and Diet"
            />
          </div>
        </div>

        {/* right bottom feature */}
        <div className="flex flex-col justify-center px-6 py-16 bg-white md:py-20 lg:py-24 sm:px-10 md:px-12 lg:px-16 xl:px-20">
          <div className="flex flex-col gap-8">
            {/* Title with Bar */}
            <div className="flex items-start gap-4">
              <div className="bg-[#5a8120] w-1.5 h-16 flex-shrink-0 mt-1"></div>
              <h2 className="text-2xl font-bold leading-tight sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl">
                We Provide{" "}
                <span className="text-[#5a8120]">Fresh Green Drinks</span> and{" "}
                <span className="text-[#5a8120]">Nutrition for Your Diet</span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-base leading-relaxed text-gray-600 md:text-lg">
              You can explore our healthy drink menu that supports your diet
              goals with delicious taste and make your wellness journey more
              enjoyable.
            </p>

            {/* Feature List */}
            <div className="flex flex-col gap-6 mt-4">
              {[
                "100% natural and organic ingredients",
                "Low calorie drinks, perfect for your diet program",
                "Chat with our nutrition staff to get personalized recommendations",
                "Free loyalty card with a minimum purchase of IDR 200.000",
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="w-6 h-6 transition-transform group-hover:scale-110">
                    <img src="/icon/icon-check.svg" alt="Icon Check" />
                  </div>
                  <p className="flex-1 text-base text-gray-700 md:text-lg">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* section 2 */}
      <div className="flex flex-col gap-10 px-4 mt-20 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="flex flex-col items-center gap-5">
          <h1 className="text-2xl font-medium sm:text-3xl md:text-4xl lg:text-5xl">
            Our <span className="text-[#5a8120]">Best Seller </span>Dishes🍃
          </h1>
          <div className="h-2 w-20 bg-[#5a8120]"></div>
          <p className="text-[#4F5665]">
            Let's choose and taste our best-selling healthy drinks. It might
            become your daily wellness companion too!
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {favouriteProducts.map((menu) => (
            <Link key={menu.id} to={`/product/${menu.id}`}>
              <CardMenu dataMenu={menu} />
            </Link>
          ))}
        </div>
      </div>

      {/* section 4 */}
      <div className="px-4 py-10 mt-20 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <Testimoni />
      </div>

      {/* section 5 */}
      <div className="flex flex-col gap-10 px-4 mt-20 mb-20 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Frequently Asked <span className="text-[#5a8120]">Questions</span>
          </h2>
          <div className="w-20 h-1 bg-[#5a8120] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our products and services
          </p>
        </div>
        <FAQSection />
      </div>

      {/* Chat */}
      <div>
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed z-50 cursor-pointer bottom-5 right-5 w-16 h-16 p-3 bg-[#5a8120] rounded-full shadow-xl hover:bg-[#b9c228] transition-all hover:scale-110">
          <img src="/icon/icon-chat.svg" alt="Icon Chat" />
        </button>
        <Chat isShow={showChat} />
      </div>
    </>
  );
}

export default HomePage;
