import { useState } from "react";
import Alert from "./Alert";
import Button from "./Button";

/**
 * CardMenu component for displaying menu item with add to cart functionality
 * @param {Object} props - Component props
 * @param {Object} props.dataMenu - Menu item data
 * @param {string|number} props.dataMenu.id - Menu item ID
 * @param {string} props.dataMenu.name - Menu item name
 * @param {string} props.dataMenu.image - Menu item image URL
 * @param {string} props.dataMenu.description - Menu item description
 * @param {number} props.dataMenu.price - Original price of menu item
 * @param {number} [props.dataMenu.discountPrice] - Discounted price if available
 * @param {boolean} [props.dataMenu.isFlashSale] - Whether item is on flash sale
 * @returns {JSX.Element} CardMenu component
 */
function CardMenu({ dataMenu }) {
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });

  let productImage;
  if (dataMenu.productImage) {
    productImage = dataMenu.productImage;
  } else {
    productImage = "/img/empty-image-placeholder.webp";
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Alert
        type={alertStatus.type}
        message={alertStatus.message}
        onClose={(e) => {
          e.preventDefault();
          setAlertStatus({ type: "", message: "" });
        }}
        onClick={(e) => {
          e.preventDefault();
        }}
      />
      <div className="relative flex-shrink-0">
        <img
          className="size-full object-cover aspect-square"
          src={productImage}
          alt={dataMenu.name}
        />
        {dataMenu.isFlashSale && (
          <span className="absolute top-2 text-xs md:text-base left-2 py-1 md:py-3 px-2 bg-[#D00000] text-white uppercase font-bold rounded-full">
            Flash sale!
          </span>
        )}
      </div>
      <div className="relative z-50 flex flex-col gap-3 py-5 mx-auto bg-white md:shadow-md md:px-4 md:w-12/13 md:-mt-13 flex-grow">
        <h1
          className="text-lg font-medium md:text-2xl line-clamp-2 min-h-[3.5rem] md:min-h-[4rem]"
          title={dataMenu.name}>
          {dataMenu.name}
        </h1>
        <p
          className="text-[#4F5665] text-xs md:text-sm line-clamp-3 min-h-[3rem] md:min-h-[3.75rem]"
          title={dataMenu.description}>
          {dataMenu.description}
        </p>
        <div className="flex flex-col items-start gap-2 md:items-center md:flex-row min-h-[2.5rem]">
          {dataMenu.discountPrice !== 0 && (
            <span className="text-sm text-red-500 line-through">
              IDR ${dataMenu.price.toLocaleString("id")}
            </span>
          )}
          <span className="font-medium text-lg md:text-2xl text-[#FF8906]">
            {dataMenu.discountPrice !== 0
              ? `IDR ${dataMenu.discountPrice.toLocaleString("id")}`
              : `IDR ${dataMenu.price.toLocaleString("id")}`}
          </span>
        </div>
        <div className="flex flex-col gap-2 md:flex-row mt-auto">
          <Button className="bg-[#FF8906] flex-2 hover:bg-[#e67a05]">
            Buy
          </Button>
          <Button className="flex-1 border border-[#FF8906] text-[#FF8906] justify-items-center content-center">
            <img src="/icon/icon-cart-orange.svg" alt="Icon Cart Orange" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CardMenu;
