import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Alert from "../components/Alert";
import Button from "../components/Button";
import CardOrder from "../components/CardOrder";
import Input from "../components/Input";
import ModalConfirmation from "../components/ModalConfirmation";
import { AuthContext } from "../context/AuthContext";
import { clearDataCart, removeDataCart } from "../redux/reducers/cart";
import { addDataOrder } from "../redux/reducers/order";

const PaymentFormSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  fullName: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
  phone: yup.string().min(10, "Phone must be at least 10 digits"),
  address: yup
    .string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters"),
});

function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(null);
  const [shipping, setShipping] = useState("Dine In");
  const [showModal, setShowModal] = useState(false);
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });
  const dataCarts = useSelector((state) => state.cart.dataCarts);
  const { userLogin } = useContext(AuthContext);

  // delete cart
  const handleRemoveItem = (cartId) => {
    dispatch(removeDataCart(cartId));
  };

  // calculate total and subtotal order
  const orderTotal = useSelector((state) =>
    state.cart.dataCarts.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  );
  const deliveryFee = 0;
  const tax = orderTotal * 0.1;
  const subTotal = orderTotal + deliveryFee + tax;

  // handle form order
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(PaymentFormSchema),
  });

  useEffect(() => {
    if (userLogin) {
      setValue("fullName", userLogin.fullName || "");
      setValue("email", userLogin.email || "");
      setValue("phone", userLogin.phone || "");
      setValue("address", userLogin.address || "");
    }
  }, [userLogin, setValue]);

  // handle submit form order
  const onSubmit = (data) => {
    try {
      setFormData(data);
      setShowModal(true);
    } catch (error) {
      setAlertStatus({
        type: "error",
        message: `An error occurred: ${error}`,
      });
    }
  };

  const handleConfirmCheckout = () => {
    try {
      const orderData = {
        fullName: formData.fullName,
        email: formData.email,
        address: formData.address,
        shipping,
        listOrders: dataCarts,
        orderTotal,
        deliveryFee,
        tax,
        subTotal,
      };

      // Save to order histories
      dispatch(addDataOrder(orderData));

      dispatch(clearDataCart());
      setShipping("Dine In");
      reset();
      setShowModal(false);
      setAlertStatus({ type: "success", message: "Checkout successful!" });

      setTimeout(() => {
        navigate("/order-history");
      }, 2000);
    } catch (error) {
      setShowModal(false);
      setAlertStatus({
        type: "error",
        message: `An error occurred: ${error}`,
      });
    }
  };

  return (
    <div className="px-4 py-6 mt-20 mb-10 sm:px-6 sm:py-8 md:px-10 md:mb-16 lg:px-16 xl:px-20 lg:mb-20">
      <Alert
        type={alertStatus.type}
        message={alertStatus.message}
        onClose={() => setAlertStatus({ type: "", message: "" })}
      />
      <ModalConfirmation
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmCheckout}
        title="Confirm Checkout"
        message={`Are you sure you want to checkout? Total: Idr. ${subTotal.toLocaleString(
          "id"
        )}`}
        confirmText="Checkout"
        cancelText="Cancel"
        type="info"
      />
      <h1 className="font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#0B0909] mb-6 sm:mb-8 md:mb-10">
        Payment Details
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-rows-2 md:grid-cols-[1.5fr_1fr] gap-6 sm:gap-8 md:gap-10">
          {/* List Card */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium sm:text-xl">Your Order</h2>
              <button
                type="button"
                onClick={() => navigate("/product")}
                className="bg-[#FF8906] text-[#0B0909] py-2 px-3 sm:px-4 rounded hover:bg-[#e67a05] transition text-sm sm:text-base">
                + Add Menu
              </button>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4">
              {dataCarts.length === 0 ? (
                <div className="py-8 text-center text-gray-500 sm:py-10">
                  <p className="text-lg sm:text-xl">Your cart is empty</p>
                  <p className="mt-2 text-sm sm:text-base">
                    Add some items to get started!
                  </p>
                </div>
              ) : (
                dataCarts.map((item) => (
                  <CardOrder
                    key={item.cartId}
                    order={item}
                    onRemove={() => handleRemoveItem(item.cartId)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="flex flex-col order-3 gap-5 md:order-2 sm:gap-6 md:gap-7">
            <h2 className="text-xl font-medium sm:text-2xl">Total</h2>
            <div className="bg-[#E8E8E84D] p-4 sm:p-5 md:p-6 flex flex-col gap-3 sm:gap-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-[#4F5665] font-bold text-sm sm:text-base">
                  Order
                </span>
                <span className="font-bold text-[#0B132A] text-sm sm:text-base">
                  Idr. {orderTotal.toLocaleString("id")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#4F5665] font-bold text-sm sm:text-base">
                  Delivery
                </span>
                <span className="font-bold text-[#0B132A] text-sm sm:text-base">
                  Idr. {deliveryFee.toLocaleString("id")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#4F5665] font-bold text-sm sm:text-base">
                  Tax
                </span>
                <span className="text-[#0B132A] font-bold text-sm sm:text-base">
                  Idr. {tax.toLocaleString("id")}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t sm:pt-4">
                <span className="font-bold text-[#4F5665] text-sm sm:text-base">
                  Sub Total
                </span>
                <span className="text-[#0B132A] font-bold text-sm sm:text-base">
                  Idr. {subTotal.toLocaleString("id")}
                </span>
              </div>
              <Button
                type="submit"
                disabled={dataCarts.length === 0}
                className="w-full bg-[#FF8906] text-[#0B0909] py-3 sm:py-4 rounded-lg hover:bg-[#e67a05] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium">
                Checkout
              </Button>

              <div>
                <h3 className="text-base sm:text-lg text-[#4F5665] mb-3 sm:mb-4">
                  We Accept
                </h3>
                <div className="flex items-center justify-around gap-2 sm:gap-3 md:gap-4">
                  <img
                    src="/icon/icon-bri.svg"
                    alt="Bank BRI"
                    className="h-4 sm:h-5"
                  />
                  <img
                    src="/icon/icon-dana.svg"
                    alt="Dana"
                    className="h-4 sm:h-5"
                  />
                  <img
                    src="/icon/icon-bca.svg"
                    alt="BCA"
                    className="h-4 sm:h-5"
                  />
                  <img
                    src="/icon/icon-gopay.svg"
                    alt="Gopay"
                    className="h-4 sm:h-5"
                  />
                  <img
                    src="/icon/icon-ovo.svg"
                    alt="OVO"
                    className="h-4 sm:h-5"
                  />
                  <img
                    src="/icon/icon-paypal.svg"
                    alt="Paypal"
                    className="h-4 sm:h-5"
                  />
                </div>
                <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500">
                  *Get Discount if you pay with Bank Central Asia
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="order-2 mt-6 sm:mt-8 md:mt-10 md:order-3">
            <h1 className="font-medium text-xl sm:text-2xl md:text-3xl text-[#0B0909] mb-6 sm:mb-8 md:mb-10">
              Payment Info & Delivery
            </h1>
            <div className="flex flex-col gap-4 sm:gap-5">
              <Input
                {...register("email")}
                error={errors}
                id="email"
                type="email"
                label="Email"
                placeholder="Enter Your Email"
              />
              <Input
                {...register("fullName")}
                error={errors}
                id="fullName"
                type="text"
                label="Full Name"
                placeholder="Enter Your Full Name"
              />
              <Input
                {...register("phone")}
                error={errors}
                id="phone"
                type="text"
                label="Phone"
                placeholder="Enter Your Number"
              />
              <Input
                {...register("address")}
                error={errors}
                id="address"
                type="text"
                label="Address"
                placeholder="Enter Your Address"
              />
              <h3 className="text-sm font-semibold sm:text-base">
                Delivery Method
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setShipping("Dine In")}
                  className={`py-2 sm:py-3 border-2 ${
                    shipping === "Dine In"
                      ? "border-[#FF8906]"
                      : "border-[#E8E8E8]"
                  } text-[#0B0909] hover:bg-[#FF8906] rounded hover:text-white transition text-xs sm:text-sm md:text-base`}>
                  Dine In
                </button>
                <button
                  type="button"
                  onClick={() => setShipping("Door Delivery")}
                  className={`py-2 sm:py-3 border-2 ${
                    shipping === "Door Delivery"
                      ? "border-[#FF8906]"
                      : "border-[#E8E8E8]"
                  } text-[#0B0909] hover:bg-[#FF8906] rounded hover:text-white transition text-xs sm:text-sm md:text-base`}>
                  Door Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setShipping("Pick Up")}
                  className={`py-2 sm:py-3 border-2 ${
                    shipping === "Pick Up"
                      ? "border-[#FF8906]"
                      : "border-[#E8E8E8]"
                  } text-[#0B0909] hover:bg-[#FF8906] rounded hover:text-white transition text-xs sm:text-sm md:text-base`}>
                  Pick Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CartPage;
