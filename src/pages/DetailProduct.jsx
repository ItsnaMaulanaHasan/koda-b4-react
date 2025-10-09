import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import CardMenu from "../components/CardMenu";
import StarRating from "../components/StarRating";
import { useFetchData } from "../hooks/useFetchData";
import { addDataCart } from "../redux/reducers/cart";

function DetailProduct() {
  // fetch data menu
  const { data, isLoading, error } = useFetchData("/data/menu.json");
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
    alert(`${menu.name} berhasil ditambahkan ke cart!`);

    // Reset ke default
    setAmount(1);
    setSize("Reguler");
    setHotIce("Ice");
  };

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (!menu) return <div>Menu tidak ditemukan</div>;

  return (
    <div className="mt-20 px-20 py-10 flex flex-col gap-20">
      <div className="grid grid-cols-2 gap-10">
        {/* Kolom Gambar */}
        <div className="flex flex-col gap-5">
          {/* Gambar Utama */}
          <div className="w-full h-96">
            <img
              className="w-full h-full object-cover"
              src={menu.image}
              alt={menu.name}
            />
          </div>
          {/* Thumbnail Gambar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="h-32 cursor-pointer hover:opacity-80 transition">
              <img
                className="w-full h-full object-cover"
                src={menu.image}
                alt={menu.name}
              />
            </div>
            <div className="h-32 cursor-pointer hover:opacity-80 transition">
              <img
                className="w-full h-full object-cover"
                src={menu.image}
                alt={menu.name}
              />
            </div>
            <div className="h-32 cursor-pointer hover:opacity-80 transition">
              <img
                className="w-full h-full object-cover"
                src={menu.image}
                alt={menu.name}
              />
            </div>
          </div>
        </div>

        {/* Kolom Detail Produk */}
        <div className="flex flex-col gap-5">
          {menu.isFlashSale && (
            <span className="py-3 px-2 bg-[#D00000] text-white uppercase font-bold rounded-full w-max">
              FLASH SALE!
            </span>
          )}
          <h1 className="text-5xl font-medium">{menu.name}</h1>
          <div className="flex items-center gap-3">
            {menu.discountPrice && (
              <span className="text-sm line-through text-red-500">
                IDR ${menu.price.toLocaleString("id")}
              </span>
            )}
            <span className="text-3xl font-medium text-[#FF8906]">
              IDR{" "}
              {menu.discountPrice
                ? menu.discountPrice.toLocaleString("id")
                : menu.price.toLocaleString("id")}
            </span>
          </div>
          <StarRating rating={menu.rating} readonly={true} size={24} />
          <div className="flex items-center gap-5 text-gray-600">
            <span className="text-sm ">200+ Review</span>
            <span className="text-2xl">|</span>
            <span className="text-sm">Recommendation</span>
            <img src="/icon/icon-thumb.svg" alt="" />
          </div>
          <p className="text-gray-700 leading-relaxed">{menu.description}</p>

          {/* Counter */}
          <div className="flex items-center border w-max rounded border-[#E8E8E8]">
            <button
              onClick={() => setAmount((prev) => prev - 1)}
              disabled={amount <= 1}
              className="size-7 border-2 border-[#FF8906] text-[#0B132A] rounded flex items-center justify-center hover:bg-[#FF8906] hover:text-white transition"
            >
              -
            </button>
            <span className="text-sm font-medium w-12 text-center">
              {amount}
            </span>
            <button
              onClick={() => setAmount((prev) => prev + 1)}
              className="size-7 bg-[#FF8906] text-[#0B132A] rounded flex items-center justify-center hover:bg-[#e67a05] transition"
            >
              +
            </button>
          </div>

          {/* Choose Size */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">Choose Size</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSize("Reguler")}
                className={`py-3 border-2 ${
                  size === "Reguler" ? "border-[#FF8906]" : "border-[#E8E8E8]"
                } text-[#0B0909] hover:bg-[#FF8906] hover:text-white transition`}
              >
                Regular
              </button>
              <button
                onClick={() => setSize("Medium")}
                className={`py-3 border-2 ${
                  size === "Medium" ? "border-[#FF8906]" : "border-[#E8E8E8]"
                } text-[#0B0909] hover:bg-[#FF8906] hover:text-white transition`}
              >
                Medium
              </button>
              <button
                onClick={() => setSize("Large")}
                className={`py-3 border-2 ${
                  size === "Large" ? "border-[#FF8906]" : "border-[#E8E8E8]"
                } text-[#0B0909] hover:bg-[#FF8906] hover:text-white transition`}
              >
                Large
              </button>
            </div>
          </div>

          {/* Hot/Ice */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">Hot/Ice?</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setHotIce("Ice")}
                className={`py-3 border-2 ${
                  hotIce === "Ice" ? "border-[#FF8906]" : "border-[#E8E8E8]"
                } text-[#0B0909] hover:bg-[#FF8906] hover:text-white transition`}
              >
                Ice
              </button>
              <button
                onClick={() => setHotIce("Hot")}
                className={`py-3 border-2 ${
                  hotIce === "Hot" ? "border-[#FF8906]" : "border-[#E8E8E8]"
                } text-[#0B0909] hover:bg-[#FF8906] hover:text-white transition`}
              >
                Hot
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <button className="py-4 bg-[#FF8906] text-[#0B132A] rounded-lg hover:bg-[#e67a05] transition">
              Buy
            </button>
            <button
              onClick={handleAddToCart}
              className="py-4 border-2 border-[#FF8906] text-[#FF8906] rounded-lg hover:bg-[#f9eeee] transition flex items-center justify-center gap-2"
            >
              <img src="/icon/icon-cart-orange.svg" alt="" />
              add to cart
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <h1 className="font-medium text-5xl">
          Recomendation <span className="text-[#8E6447]">For You</span>
        </h1>

        <div className="grid grid-cols-3 gap-5">
          {currentData.map((menu) => (
            <Link key={menu.id} to={`/product/${menu.id}`}>
              <CardMenu dataMenu={menu} />
            </Link>
          ))}
        </div>

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
  );
}

export default DetailProduct;
