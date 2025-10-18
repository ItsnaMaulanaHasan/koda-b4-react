import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { addDataCart } from "../redux/reducers/cart";
import Alert from "./Alert";
import Button from "./Button";
import ModalConfirmation from "./ModalConfirmation";

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
  const [showModal, setShowModal] = useState(false);
  const { userLogin } = useContext(AuthContext);
  const isAuthenticated = !!userLogin?.email;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const redirectToLogin = (e) => {
    e.preventDefault();
    navigate("/auth/login");
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      const cartItem = {
        menuId: dataMenu.id,
        name: dataMenu.name,
        image: dataMenu.image,
        price: dataMenu.discountPrice || dataMenu.price,
        originalPrice: dataMenu.price,
        size: "Reguler",
        hotIce: "Ice",
        quantity: 1,
        isFlashSale: dataMenu.isFlashSale,
      };

      dispatch(addDataCart(cartItem));
      setAlertStatus({
        type: "success",
        message: "Successfully added to cart",
      });
    } else {
      setShowModal(true);
    }
  };
  return (
    <div className="w-full h-full">
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
      <ModalConfirmation
        isOpen={showModal}
        onClose={handleCancel}
        onConfirm={redirectToLogin}
        title="Confirm Login"
        message="Please login to add to cart!"
        confirmText="Login"
        cancelText="Cancel"
        type="info"
      />
      <div className="relative">
        <img className="size-full" src={dataMenu.image} alt={dataMenu.name} />
        {dataMenu.isFlashSale && (
          <span className="absolute top-2 text-xs md:text-base left-2 py-1 md:py-3 px-2 bg-[#D00000] text-white uppercase font-bold rounded-full">
            Flash sale!
          </span>
        )}
      </div>
      <div className="relative z-50 flex flex-col gap-3 py-5 mx-auto bg-white md:shadow-md md:px-4 md:w-12/13 md:-mt-13">
        <h1 className="text-lg font-medium md:text-2xl">{dataMenu.name}</h1>
        <p className="text-[#4F5665] text-xs md:text-sm">
          {dataMenu.description}
        </p>
        <div className="flex flex-col items-start gap-2 md:items-center md:flex-row">
          {dataMenu.discountPrice && (
            <span className="text-sm text-red-500 line-through">
              IDR ${dataMenu.price.toLocaleString("id")}
            </span>
          )}
          <span className="font-medium text-lg md:text-2xl text-[#FF8906]">
            {dataMenu.discountPrice
              ? `IDR ${dataMenu.discountPrice.toLocaleString("id")}`
              : `IDR ${dataMenu.price.toLocaleString("id")}`}
          </span>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <Button className="bg-[#FF8906] flex-2">Buy</Button>
          <Button
            onClick={handleAddToCart}
            className="flex-1 border border-[#FF8906] text-[#FF8906] justify-items-center content-center">
            <img src="/icon/icon-cart-orange.svg" alt="Icon Cart Orange" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CardMenu;
