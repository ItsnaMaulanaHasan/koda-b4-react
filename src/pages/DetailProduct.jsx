import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Link,
  ScrollRestoration,
  useNavigate,
  useParams,
} from "react-router-dom";
import Alert from "../components/Alert";
import Button from "../components/Button";
import CardMenu from "../components/CardMenu";
import ModalConfirmation from "../components/ModalConfirmation";
import StarRating from "../components/StarRating";
import { AuthContext } from "../context/AuthContext";
import { useFetchData } from "../hooks/useFetchData";
import { addAmountCarts } from "../redux/reducers/cart";

function DetailProduct() {
  // fetch data product
  const { id: idProduct } = useParams();
  const {
    data: { data: product },
    isLoading,
    error,
  } = useFetchData(import.meta.env.VITE_BASE_URL + "/products/" + idProduct);
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { accessToken } = useContext(AuthContext);
  const isAuthenticated = !!accessToken;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(1);

  const [sizeId, setSizeId] = useState(null);
  const [variantId, setVariantId] = useState(null);

  useEffect(() => {
    if (product?.productSizes?.length > 0 && sizeId === null) {
      setSizeId(product.productSizes[0].id);
    }
    if (product?.productVariants?.length > 0 && variantId === null) {
      setVariantId(product.productVariants[0].id);
    }
  }, [product, sizeId, variantId]);

  // handle pagination recomendations
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const recommendations = product?.recomendations || [];
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = recommendations.slice(indexOfFirstItem, indexOfLastItem);

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
  const handleAddToCart = async () => {
    if (isAuthenticated) {
      setIsProcessing(true);
      try {
        const cartItem = {
          productId: product.id,
          sizeId: sizeId,
          variantId: variantId,
          amount: amount,
        };

        const res = await fetch(import.meta.env.VITE_BASE_URL + "/carts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cartItem),
        });

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.message || "Failed to add cart");
        }

        const result = await res.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        if (result.data.id !== 0) {
          dispatch(addAmountCarts());
        }

        setAlertStatus({
          type: "success",
          message: "Successfully added to cart",
        });

        // Reset ke default
        setAmount(1);
        setSizeId(product.productSizes[0].id);
        setVariantId(product.productVariants[0].id);
      } catch (error) {
        let errorMessage = "Failed to add cart";
        if (error.message) {
          errorMessage = error.message;
        } else if (!navigator.onLine) {
          errorMessage = "No internet connection";
        }
        setAlertStatus({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setIsProcessing(false);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleBuy = async () => {
    if (isAuthenticated) {
      setIsProcessing(true);
      try {
        const cartItem = {
          productId: product.id,
          sizeId: sizeId,
          variantId: variantId,
          amount: amount,
        };

        const res = await fetch(import.meta.env.VITE_BASE_URL + "/carts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cartItem),
        });

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.message || "Failed to add cart");
        }

        const result = await res.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        if (result.data.id !== 0) {
          dispatch(addAmountCarts());
        }

        navigate("/cart");

        // Reset ke default
        setAmount(1);
        setSizeId(product.productSizes[0].id);
        setVariantId(product.productVariants[0].id);
      } catch (error) {
        let errorMessage = "Failed to add cart";
        if (error.message) {
          errorMessage = error.message;
        } else if (!navigator.onLine) {
          errorMessage = "No internet connection";
        }
        setAlertStatus({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setIsProcessing(false);
      }
    } else {
      setShowModal(true);
    }
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

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Product not found
      </div>
    );

  return (
    <div className="flex flex-col gap-10 px-4 py-6 mt-16 sm:gap-12 sm:px-6 sm:py-8 sm:mt-20 md:gap-16 md:px-10 md:py-10 lg:gap-20 lg:px-16 xl:px-20">
      <ScrollRestoration />
      <Alert
        type={alertStatus.type}
        message={alertStatus.message}
        onClose={() => {
          setAlertStatus({ type: "", message: "" });
        }}
      />
      <ModalConfirmation
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => navigate("/auth/login")}
        title="Confirm Login"
        message="Please log in first"
        confirmText="Login"
        cancelText="Cancel"
        type="info"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
        {/* Kolom Gambar */}
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
          {/* Gambar Utama */}
          <div className="w-full h-64 sm:h-80 md:h-96">
            <img
              className="object-cover w-full h-full"
              src={
                product.prouductImages || "/img/empty-image-placeholder.webp"
              }
              alt={product.name}
            />
          </div>
          {/* Thumbnail Gambar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="h-32 transition cursor-pointer hover:opacity-80">
              <img
                className="object-cover w-full h-full"
                src={
                  product.prouductImages || "/img/empty-image-placeholder.webp"
                }
                alt={product.name}
              />
            </div>
            <div className="h-32 transition cursor-pointer hover:opacity-80">
              <img
                className="object-cover w-full h-full"
                src={
                  product.prouductImages || "/img/empty-image-placeholder.webp"
                }
                alt={product.name}
              />
            </div>
            <div className="h-32 transition cursor-pointer hover:opacity-80">
              <img
                className="object-cover w-full h-full"
                src={
                  product.prouductImages || "/img/empty-image-placeholder.webp"
                }
                alt={product.name}
              />
            </div>
          </div>
        </div>

        {/* Kolom Detail Produk */}
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
          {product.isFlashSale && (
            <span className="py-2 px-3 sm:py-3 sm:px-4 bg-[#D00000] text-white uppercase font-bold rounded-full w-max text-xs sm:text-sm">
              FLASH SALE!
            </span>
          )}
          <h1 className="text-2xl font-medium sm:text-3xl md:text-4xl lg:text-5xl">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            {product.discountPrice !== 0 && (
              <span className="text-xs text-red-500 line-through sm:text-sm">
                IDR ${product.price.toLocaleString("id")}
              </span>
            )}
            <span className="text-xl font-medium sm:text-2xl md:text-3xl text-[#5a8120]">
              IDR{" "}
              {product.discountPrice
                ? product.discountPrice.toLocaleString("id")
                : product.price.toLocaleString("id")}
            </span>
          </div>
          <StarRating rating={product.rating} readonly={true} size={20} />
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
            {product.description}
          </p>

          {/* Counter */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 border w-max rounded border-[#E8E8E8]">
                <Button
                  onClick={() => setAmount((prev) => prev - 1)}
                  disabled={amount <= 1 || isProcessing}
                  className="size-6 sm:size-7 border-2 border-[#5a8120] flex items-center justify-center hover:bg-[#5a8120] hover:text-white transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                  -
                </Button>
                <span className="w-10 text-xs font-medium text-center md:w-auto sm:text-sm">
                  {amount}
                </span>
                <Button
                  onClick={() => setAmount((prev) => prev + 1)}
                  disabled={amount >= product.stock || isProcessing}
                  className="size-6 sm:size-7 bg-[#5a8120] flex items-center justify-center hover:bg-[#b9c228] transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                  +
                </Button>
              </div>

              {/* Stock Info */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-600 sm:text-sm">
                  Stock: {product.stock}
                </span>
                {amount >= product.stock && (
                  <span className="text-xs font-medium text-red-500 sm:text-sm">
                    Maximum stock reached!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Choose Size */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <h3 className="font-semibold">Choose Size</h3>
            <div className="flex gap-2 sm:gap-3">
              {product.productSizes?.map((size) => (
                <Button
                  key={size.id}
                  onClick={() => setSizeId(size.id)}
                  disabled={isProcessing}
                  className={`py-3 border-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                    sizeId === size.id ? "border-[#5a8120]" : "border-[#E8E8E8]"
                  } hover:bg-[#5a8120] hover:text-white transition text-sm md:text-base`}>
                  {size.size}
                </Button>
              ))}
            </div>
          </div>

          {/* Variant */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <h3 className="font-semibold">Variant</h3>
            <div className="flex gap-2 sm:gap-3">
              {product.productVariants?.map((variant) => (
                <Button
                  key={variant.id}
                  disabled={isProcessing}
                  onClick={() => setVariantId(variant.id)}
                  className={`py-3 border-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                    variantId === variant.id
                      ? "border-[#5a8120]"
                      : "border-[#E8E8E8]"
                  } hover:bg-[#5a8120] hover:text-white transition text-sm md:text-base`}>
                  {variant.variant}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-2 mt-3 sm:gap-3 sm:mt-4 md:grid-cols-2 md:mt-5">
            <Button
              onClick={handleBuy}
              disabled={isProcessing}
              className="py-3 sm:py-4 bg-[#5a8120] hover:bg-[#b9c228] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              Buy
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={isProcessing}
              className="py-3 sm:py-4 border-2 border-[#5a8120] text-[#5a8120] hover:bg-[#f9eeee] transition flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              <img
                className="size-5"
                src="/icon/icon-cart-orange.svg"
                alt="Icon Cart"
              />
              Add to cart
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
        <h1 className="text-xl font-medium sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
          Recomendation <span className="text-[#5a8120]">For You</span>
        </h1>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5">
          {currentData.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <CardMenu dataMenu={product} />
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
                  ? "bg-[#5a8120] text-[#0B0909]"
                  : "bg-[#E8E8E8] text-[#A0A3BD] hover:bg-gray-300"
              }`}>
              {index + 1}
            </button>
          ))}
          <button
            onClick={handleNext}
            className="size-8 sm:size-10 rounded-full bg-[#5a8120] text-white flex items-center justify-center hover:bg-[#b9c228] transition text-sm sm:text-base">
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailProduct;
