import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Alert from "../components/Alert";
import Button from "../components/Button";
import CardOrder from "../components/CardOrder";
import Input from "../components/Input";
import ModalConfirmation from "../components/ModalConfirmation";
import {
  clearDataCart,
  getTotalCart,
  removeDataCart,
} from "../redux/reducers/cart";
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
  address: yup
    .string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters"),
});

function CartPage() {
  const navigate = useNavigate();
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });
  const [shipping, setShipping] = useState("Dine In");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const dataCarts = useSelector((state) => state.cart.dataCarts);
  const dispatch = useDispatch();

  // delete cart
  const handleRemoveItem = (cartId) => {
    dispatch(removeDataCart(cartId));
  };

  // calculate total and subtotal order
  const orderTotal = dispatch(getTotalCart());
  const deliveryFee = 0;
  const tax = orderTotal * 0.1;
  const subTotal = orderTotal + deliveryFee + tax;

  // handle form order
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PaymentFormSchema),
  });

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
    <div className="px-20 py-10 mt-20 mb-20">
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
      <h1 className="font-medium text-5xl text-[#0B0909] mb-10">
        Payment Details
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-rows-2 grid-cols-[1.5fr_1fr] gap-10">
          {/* List Card */}
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Your Order</h2>
              <button
                type="button"
                onClick={() => navigate("/product")}
                className="bg-[#FF8906] text-[#0B0909] py-2 px-4 rounded hover:bg-[#e67a05] transition"
              >
                + Add Menu
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {dataCarts.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p className="text-xl">Your cart is empty</p>
                  <p className="mt-2">Add some items to get started!</p>
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
          <div className="flex flex-col gap-7">
            <h2 className="text-2xl font-medium">Total</h2>
            <div className="bg-[#E8E8E84D] p-6 flex flex-col gap-4 border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-[#4F5665] font-bold">Order</span>
                <span className="font-bold text-[#0B132A]">
                  Idr. {orderTotal.toLocaleString("id")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#4F5665] font-bold">Delivery</span>
                <span className="font-bold text-[#0B132A]">
                  Idr. {deliveryFee.toLocaleString("id")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#4F5665] font-bold">Tax</span>
                <span className="text-[#0B132A] font-bold">
                  Idr. {tax.toLocaleString("id")}
                </span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-bold text-[#4F5665]">Sub Total</span>
                <span className="text-[#0B132A] font-bold">
                  Idr. {subTotal.toLocaleString("id")}
                </span>
              </div>
              <Button
                type="submit"
                disabled={dataCarts.length === 0}
                className="w-full bg-[#FF8906] text-[#0B0909] py-4 rounded-lg hover:bg-[#e67a05] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout
              </Button>

              <div>
                <h3 className="text-lg text-[#4F5665] mb-4">We Accept</h3>
                <div className="flex gap-4 items-center justify-around">
                  <img
                    src="/icon/icon-bri.svg"
                    alt="Bank BRI"
                    className="h-5"
                  />
                  <img src="/icon/icon-dana.svg" alt="Dana" className="h-5" />
                  <img src="/icon/icon-bca.svg" alt="BCA" className="h-5" />
                  <img src="/icon/icon-gopay.svg" alt="Gopay" className="h-5" />
                  <img src="/icon/icon-ovo.svg" alt="OVO" className="h-5" />
                  <img
                    src="/icon/icon-paypal.svg"
                    alt="Paypal"
                    className="h-5"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  *Get Discount if you pay with Bank Central Asia
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-10">
            <h1 className="font-medium text-3xl text-[#0B0909] mb-10">
              Payment Info & Delivery
            </h1>
            <div className="flex flex-col gap-5">
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
                {...register("address")}
                error={errors}
                id="address"
                type="text"
                label="Address"
                placeholder="Enter Your Address"
              />
              <h3 className="font-semibold">Delivery Method</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setShipping("Dine In")}
                  className={`py-3 border-2 ${
                    shipping === "Dine In"
                      ? "border-[#FF8906]"
                      : "border-[#E8E8E8]"
                  } text-[#0B0909] hover:bg-[#FF8906] rounded hover:text-white transition`}
                >
                  Dine In
                </button>
                <button
                  type="button"
                  onClick={() => setShipping("Door Delivery")}
                  className={`py-3 border-2 ${
                    shipping === "Door Delivery"
                      ? "border-[#FF8906]"
                      : "border-[#E8E8E8]"
                  } text-[#0B0909] hover:bg-[#FF8906] rounded hover:text-white transition`}
                >
                  Door Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setShipping("Pick Up")}
                  className={`py-3 border-2 ${
                    shipping === "Pick Up"
                      ? "border-[#FF8906]"
                      : "border-[#E8E8E8]"
                  } text-[#0B0909] hover:bg-[#FF8906] rounded hover:text-white transition`}
                >
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
