/**
 * CardCart component for displaying cart item in cart with remove functionality
 * @param {Object} props - Component props
 * @param {Object} props.cart - Cart item data
 * @param {string} props.cart.productImage - Product image URL
 * @param {string} props.cart.productName - Product name
 * @param {boolean} [props.cart.isFlashSale] - Whether item is on flash sale
 * @param {number} props.cart.amount - Quantity of items ordered
 * @param {string} props.cart.sizeName - Size of the product (e.g., "Reguler", "Large")
 * @param {string} props.cart.variantName - Temperature preference (e.g., "Hot", "Ice")
 * @param {number} props.cart.discountPrice - Current price per item
 * @param {number} [props.cart.productPrice] - Original price before discount
 * @param {Function} props.onRemove - Callback function when remove button is clicked
 * @returns {JSX.Element} CardCart component
 */
function CardCart({ cart, onRemove, remove = true }) {
  return (
    <div className="flex gap-3 p-2 items-center bg-[#E8E8E84D] sm:gap-4 sm:p-3">
      <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
        <img
          src={cart.productImage || "/img/empty-image-placeholder.webp"}
          alt={cart.productName}
          className="object-cover w-full h-full rounded"
        />
      </div>
      <div className="flex flex-col flex-1 gap-2 sm:gap-3">
        {cart.isFlashSale && (
          <span className="py-1 px-2 bg-[#D00000] text-white uppercase font-bold rounded-full text-[10px] w-max sm:px-3 sm:text-xs">
            Flash sale!
          </span>
        )}

        <h3 className="text-base font-semibold sm:text-lg md:text-xl">
          {cart.productName}
        </h3>

        <p className="flex gap-1 text-xs text-gray-600 sm:text-sm sm:gap-2">
          <span>{cart.amount}pcs</span>
          <span>|</span>
          <span>{cart.sizeName}</span>
          <span>|</span>
          <span>{cart.variantName}</span>
        </p>

        <div className="flex items-center gap-2 sm:gap-3">
          {cart.discountPrice !== 0 && (
            <span className="text-xs text-red-500 line-through sm:text-sm">
              IDR{cart.productPrice.toLocaleString("id")}
            </span>
          )}
          <span className="text-sm font-medium text-[#FF8906] sm:text-lg md:text-xl">
            IDR{" "}
            {cart.discountPrice
              ? cart.discountPrice.toLocaleString("id")
              : cart.productPrice.toLocaleString("id")}
          </span>
        </div>
      </div>

      {remove && (
        <button
          onClick={onRemove}
          className="flex items-center self-start justify-center flex-shrink-0 text-red-500 transition border-2 border-red-500 rounded-full md:self-center w-7 h-7 hover:bg-red-500 hover:text-white sm:w-8 sm:h-8">
          ✕
        </button>
      )}
    </div>
  );
}

export default CardCart;
