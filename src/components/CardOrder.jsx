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
    <div className="flex gap-4 p-3 items-center bg-[#E8E8E84D]">
      <div className="w-32 h-32 flex-shrink-0">
        <img
          src={order.image}
          alt={order.name}
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="flex flex-col gap-3 flex-1">
        {order.isFlashSale && (
          <span className="py-1 px-3 bg-[#D00000] text-white uppercase font-bold rounded-full text-xs w-max">
            Flash sale!
          </span>
        )}

        <h3 className="text-xl font-semibold">{order.name}</h3>

        <p className="text-gray-600 text-sm flex gap-2">
          <span>{order.quantity}pcs</span>
          <span>|</span>
          <span>{order.size}</span>
          <span>|</span>
          <span>{order.hotIce}</span>
          <span>|</span>
          <span>Dine In</span>
        </p>

        <div className="flex items-center gap-3">
          {order.originalPrice && order.originalPrice !== order.price && (
            <span className="text-sm line-through text-red-500">
              IDR{order.originalPrice.toLocaleString("id")}
            </span>
          )}
          <span className="text-2xl font-medium text-[#FF8906]">
            IDR {(order.price * order.quantity).toLocaleString("id")}
          </span>
        </div>
      </div>

      <button
        onClick={onRemove}
        className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
      >
        ✕
      </button>
    </div>
  );
}

export default CardOrder;
