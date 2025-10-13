import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../components/Alert";
import Button from "../components/Button";
import CardMenu from "../components/CardMenu";
import StarRating from "../components/StarRating";
import { useFetchData } from "../hooks/useFetchData";
import { addDataCart } from "../redux/reducers/cart";

function DetailProduct() {
  // fetch data menu
  const { data, isLoading, error } = useFetchData("/data/menu.json");
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate();
  const { id: idMenu } = useParams();
  const menu = data.find((menu) => menu.id === parseInt(idMenu));
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(1);
  const [size, setSize] = useState("Reguler");
  const [hotIce, setHotIce] = useState("Ice");

  // handle pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1));
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // handle add to cart
  const handleAddToCart = () => {
    const cartItem = {
      menuId: menu.id,
      name: menu.name,
      image: menu.image,
      price: menu.discountPrice || menu.price,
      originalPrice: menu.price,
      size: size,
      hotIce: hotIce,
      quantity: amount,
    };

    dispatch(addDataCart(cartItem));
    setAlertStatus({ type: "success", message: "Successfully added to cart" });

    // Reset ke default
    setAmount(1);
    setSize("Reguler");
    setHotIce("Ice");
  };

  const handleBuy = () => {
    const cartItem = {
      menuId: menu.id,
      name: menu.name,
      image: menu.image,
      price: menu.discountPrice || menu.price,
      originalPrice: menu.price,
      size: size,
      hotIce: hotIce,
      quantity: amount,
    };

    dispatch(addDataCart(cartItem));

    // Reset ke default
    setAmount(1);
    setSize("Reguler");
    setHotIce("Ice");

    navigate("/cart");
  };

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (!menu) return <div>Menu tidak ditemukan</div>;

  return (
    <div className="flex flex-col gap-10 px-4 py-6 mt-16 sm:gap-12 sm:px-6 sm:py-8 sm:mt-20 md:gap-16 md:px-10 md:py-10 lg:gap-20 lg:px-16 xl:px-20">
      <Alert
        type={alertStatus.type}
        message={alertStatus.message}
        onClose={() => {
          setAlertStatus({ type: "", message: "" });
        }}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
        {/* Kolom Gambar */}
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
          {/* Gambar Utama */}
          <div className="w-full h-64 sm:h-80 md:h-96">
            <img
              className="object-cover w-full h-full"
              src={menu.image}
              alt={menu.name}
            />
          </div>
          {/* Thumbnail Gambar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="h-32 transition cursor-pointer hover:opacity-80">
              <img
                className="object-cover w-full h-full"
                src={menu.image}
                alt={menu.name}
              />
            </div>
            <div className="h-32 transition cursor-pointer hover:opacity-80">
              <img
                className="object-cover w-full h-full"
                src={menu.image}
                alt={menu.name}
              />
            </div>
            <div className="h-32 transition cursor-pointer hover:opacity-80">
              <img
                className="object-cover w-full h-full"
                src={menu.image}
                alt={menu.name}
              />
            </div>
          </div>
        </div>

        {/* Kolom Detail Produk */}
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
          {menu.isFlashSale && (
            <span className="py-2 px-3 sm:py-3 sm:px-4 bg-[#D00000] text-white uppercase font-bold rounded-full w-max text-xs sm:text-sm">
              FLASH SALE!
            </span>
          )}
          <h1 className="text-2xl font-medium sm:text-3xl md:text-4xl lg:text-5xl">
            {menu.name}
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            {menu.discountPrice && (
              <span className="text-xs text-red-500 line-through sm:text-sm">
                IDR ${menu.price.toLocaleString("id")}
              </span>
            )}
            <span className="text-xl font-medium sm:text-2xl md:text-3xl text-[#FF8906]">
              IDR{" "}
              {menu.discountPrice
                ? menu.discountPrice.toLocaleString("id")
                : menu.price.toLocaleString("id")}
            </span>
          </div>
          <StarRating rating={menu.rating} readonly={true} size={20} />
          <div className="flex items-center gap-3 text-gray-600 sm:gap-4 md:gap-5">
            <span className="text-xs sm:text-sm">200+ Review</span>
            <span className="text-lg sm:text-xl md:text-2xl">|</span>
            <span className="text-xs sm:text-sm">Recommendation</span>
            <img
              className="w-4 h-4 sm:w-5 sm:h-5"
              src="/icon/icon-thumb.svg"
              alt="Icon Thumb"
            />
          </div>
          <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
            {menu.description}
          </p>

          {/* Counter */}
          <div className="flex items-center border w-max rounded border-[#E8E8E8]">
            <Button
              onClick={() => setAmount((prev) => prev - 1)}
              disabled={amount <= 1}
              className="size-6 sm:size-7 border-2 border-[#FF8906] flex items-center justify-center hover:bg-[#FF8906] hover:text-white transition text-sm sm:text-base">
              -
            </Button>
            <span className="w-10 text-xs font-medium text-center sm:w-12 sm:text-sm">
              {amount}
            </span>
            <Button
              onClick={() => setAmount((prev) => prev + 1)}
              className="size-6 sm:size-7 bg-[#FF8906] flex items-center justify-center hover:bg-[#e67a05] transition text-sm sm:text-base">
              +
            </Button>
          </div>

          {/* Choose Size */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <h3 className="font-semibold">Choose Size</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <Button
                onClick={() => setSize("Reguler")}
                className={`py-3 border-2 ${
                  size === "Reguler" ? "border-[#FF8906]" : "border-[#E8E8E8]"
                } hover:bg-[#FF8906] hover:text-white transition text-sm md:text-base`}>
                Regular
              </Button>
              <Button
                onClick={() => setSize("Medium")}
                className={`py-3 border-2 ${
                  size === "Medium" ? "border-[#FF8906]" : "border-[#E8E8E8]"
                } hover:bg-[#FF8906] hover:text-white transition text-sm md:text-base`}>
                Medium
              </Button>
              <Button
                onClick={() => setSize("Large")}
                className={`py-3 border-2 ${
                  size === "Large" ? "border-[#FF8906]" : "border-[#E8E8E8]"
                } hover:bg-[#FF8906] hover:text-white transition text-sm md:text-base`}>
                Large
              </Button>
            </div>
          </div>

          {/* Hot/Ice */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <h3 className="font-semibold">Hot/Ice?</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Button
                onClick={() => setHotIce("Ice")}
                className={`py-3 border-2 ${
                  hotIce === "Ice" ? "border-[#FF8906]" : "border-[#E8E8E8]"
                } hover:bg-[#FF8906] hover:text-white transition text-sm md:text-base`}>
                Ice
              </Button>
              <Button
                onClick={() => setHotIce("Hot")}
                className={`py-3 border-2 ${
                  hotIce === "Hot" ? "border-[#FF8906]" : "border-[#E8E8E8]"
                } hover:bg-[#FF8906] hover:text-white transition text-sm md:text-base`}>
                Hot
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-2 mt-3 sm:gap-3 sm:mt-4 md:grid-cols-2 md:mt-5">
            <Button
              onClick={handleBuy}
              className="py-3 sm:py-4 bg-[#FF8906] hover:bg-[#e67a05] transition font-medium">
              Buy
            </Button>
            <Button
              onClick={handleAddToCart}
              className="py-3 sm:py-4 border-2 border-[#FF8906] text-[#FF8906] hover:bg-[#f9eeee] transition flex items-center justify-center gap-2 font-medium">
              <img
                className="size-5"
                src="/icon/icon-cart-orange.svg"
                alt="Icon Cart"
              />
              add to cart
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
        <h1 className="text-xl font-medium sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
          Recomendation <span className="text-[#8E6447]">For You</span>
        </h1>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5">
          {currentData.map((menu) => (
            <Link key={menu.id} to={`/product/${menu.id}`}>
              <CardMenu dataMenu={menu} />
            </Link>
          ))}
        </div>

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
  );
}

export default DetailProduct;
