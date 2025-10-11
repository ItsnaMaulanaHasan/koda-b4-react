/**
 * CardOrder component for displaying order item in cart with remove functionality
 * @param {Object} props - Component props
 * @param {Object} props.order - Order item data
 * @param {string} props.order.image - Product image URL
 * @param {string} props.order.name - Product name
 * @param {boolean} [props.order.isFlashSale] - Whether item is on flash sale
 * @param {number} props.order.quantity - Quantity of items ordered
 * @param {string} props.order.size - Size of the product (e.g., "Reguler", "Large")
 * @param {string} props.order.hotIce - Temperature preference (e.g., "Hot", "Ice")
 * @param {number} props.order.price - Current price per item
 * @param {number} [props.order.originalPrice] - Original price before discount
 * @param {Function} props.onRemove - Callback function when remove button is clicked
 * @returns {JSX.Element} CardOrder component
 */
function CardOrder({ order, onRemove }) {
  return (
    <div className="flex gap-3 p-2 items-center bg-[#E8E8E84D] sm:gap-4 sm:p-3">
      <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
        <img
          src={order.image}
          alt={order.name}
          className="object-cover w-full h-full rounded"
        />
      </div>
      <div className="flex flex-col flex-1 gap-2 sm:gap-3">
        {order.isFlashSale && (
          <span className="py-1 px-2 bg-[#D00000] text-white uppercase font-bold rounded-full text-[10px] w-max sm:px-3 sm:text-xs">
            Flash sale!
          </span>
        )}

        <h3 className="text-base font-semibold sm:text-lg md:text-xl">
          {order.name}
        </h3>

        <p className="flex gap-1 text-xs text-gray-600 sm:text-sm sm:gap-2">
          <span>{order.quantity}pcs</span>
          <span>|</span>
          <span>{order.size}</span>
          <span>|</span>
          <span>{order.hotIce}</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">Dine In</span>
        </p>

        <div className="flex items-center gap-2 sm:gap-3">
          {order.originalPrice && order.originalPrice !== order.price && (
            <span className="text-xs text-red-500 line-through sm:text-sm">
              IDR{order.originalPrice.toLocaleString("id")}
            </span>
          )}
          <span className="text-lg font-medium text-[#FF8906] sm:text-xl md:text-2xl">
            IDR {(order.price * order.quantity).toLocaleString("id")}
          </span>
        </div>
      </div>

      <button
        onClick={onRemove}
        className="flex items-center self-start justify-center flex-shrink-0 text-red-500 transition border-2 border-red-500 rounded-full md:self-center w-7 h-7 hover:bg-red-500 hover:text-white sm:w-8 sm:h-8">
        ✕
      </button>
    </div>
  );
}

export default CardOrder;
