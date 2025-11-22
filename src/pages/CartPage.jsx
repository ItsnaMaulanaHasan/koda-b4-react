import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Alert from "../components/Alert";
import Button from "../components/Button";
import CardCart from "../components/CardCart";
import Input from "../components/Input";
import ModalConfirmation from "../components/ModalConfirmation";
import { AuthContext } from "../context/AuthContext";
import { useFetchData } from "../hooks/useFetchData";
import { clearCarts, reduceAmountCarts } from "../redux/reducers/cart";

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
  const { accessToken } = useContext(AuthContext);
  const {
    data: { data: dataCarts = [] },
    isLoading,
    error,
    refetch: refetchCarts,
  } = useFetchData(import.meta.env.VITE_BASE_URL + "/carts", accessToken);
  const {
    data: { data: orderMethods = [] },
  } = useFetchData(import.meta.env.VITE_BASE_URL + "/order-methods");
  const {
    data: { data: paymentMethods = [] },
  } = useFetchData(import.meta.env.VITE_BASE_URL + "/payment-methods");

  const [formData, setFormData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });

  const userLogin = useSelector((state) => state.profile.dataProfile);

  const [orderMethodId, setOrderMethodId] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  useEffect(() => {
    if (orderMethods?.length > 0 && orderMethodId === null) {
      setOrderMethodId(orderMethods[0].id);
    }
    if (paymentMethods?.length > 0 && paymentMethodId === null) {
      setPaymentMethodId(paymentMethods[0].id);
    }
  }, [orderMethodId, orderMethods, paymentMethodId, paymentMethods, showModal]);

  // delete cart
  const handleRemoveItem = async (cartId) => {
    try {
      const res = await fetch(
        import.meta.env.VITE_BASE_URL + `/carts/${cartId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Failed to delete cart");
      }

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      dispatch(reduceAmountCarts());
      refetchCarts();

      reset({
        email: userLogin?.email || "",
        fullName: userLogin?.fullName || "",
        phone: userLogin?.phone || "",
        address: userLogin?.address || "",
      });

      setAlertStatus({
        type: "success",
        message: result.message,
      });
    } catch (error) {
      let errorMessage = "Failed delete cart";
      if (error.message) {
        errorMessage = error.message;
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection";
      }
      setAlertStatus({
        type: "error",
        message: errorMessage,
      });
    }
  };

  // calculate total and subtotal order
  const { orderTotal, deliveryFee, tax, subTotal } = useMemo(() => {
    const total =
      dataCarts?.reduce((sum, item) => sum + (item.subtotal || 0), 0) || 0;

    const selectedMethod = orderMethods?.find(
      (method) => method.id === orderMethodId
    );
    const delivery = selectedMethod?.deliveryFee || 0;

    const calculatedTax = total * 0.1;
    const calculatedSubTotal = total + delivery + calculatedTax;

    return {
      orderTotal: total,
      deliveryFee: delivery,
      tax: calculatedTax,
      subTotal: calculatedSubTotal,
    };
  }, [dataCarts, orderMethods, orderMethodId]);

  // handle form order
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PaymentFormSchema),
    defaultValues: {
      fullName: userLogin?.fullName,
      email: userLogin?.email,
      phone: userLogin?.phone,
      address: userLogin?.address,
    },
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

  const handleConfirmCheckout = async () => {
    try {
      const orderData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        orderMethodId,
        paymentMethodId,
      };

      const res = await fetch(import.meta.env.VITE_BASE_URL + "/transactions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Failed to checkout");
      }

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      dispatch(clearCarts());
      reset();
      setShowModal(false);
      setAlertStatus({ type: "success", message: "Checkout successful!" });

      setTimeout(() => {
        navigate("/order-history");
      }, 2000);
    } catch (error) {
      let errorMessage = "Failed to checkout";
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
      setShowModal(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

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
              <Button
                type="button"
                onClick={() => navigate("/product")}
                className="bg-[#FF8906] w-max py-2 px-3 sm:px-4 hover:bg-[#e67a05] transition text-sm sm:text-base">
                + Add Menu
              </Button>
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
                  <CardCart
                    key={item.id}
                    cart={item}
                    onRemove={() => handleRemoveItem(item.id)}
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
                  Total
                </span>
                <span className="text-[#0B132A] font-bold text-sm sm:text-base">
                  Idr. {subTotal.toLocaleString("id")}
                </span>
              </div>
              <Button
                type="submit"
                disabled={dataCarts.length === 0}
                className="bg-[#FF8906] py-3 sm:py-4 hover:bg-[#e67a05] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium">
                Checkout
              </Button>

              <div>
                <h3 className="text-base sm:text-lg text-[#4F5665] mb-3 sm:mb-4">
                  We Accept
                </h3>
                <div className="grid grid-cols-6 items-center justify-around gap-2 sm:gap-3 md:gap-4">
                  {paymentMethods?.map((paymentMethod) => (
                    <Button
                      key={paymentMethod.id}
                      type="button"
                      onClick={() => setPaymentMethodId(paymentMethod.id)}
                      className={`p-2 sm:p-3 border-2 ${
                        paymentMethodId === paymentMethod.id
                          ? "border-[#FF8906]"
                          : "border-[#E8E8E8]"
                      } hover:bg-[#FF8906] transition`}>
                      <img
                        src={
                          paymentMethod.image ||
                          "/public/img/empty-image-placeholder.webp"
                        }
                        alt={paymentMethod.name}
                        className="object-contain w-full h-4 sm:h-5"
                      />
                    </Button>
                  ))}
                </div>
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
                Order Method
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {orderMethods?.map((orderMethod) => (
                  <Button
                    key={orderMethod.id}
                    type="button"
                    onClick={() => setOrderMethodId(orderMethod.id)}
                    className={`py-2 sm:py-3 border-2 ${
                      orderMethodId === orderMethod.id
                        ? "border-[#FF8906]"
                        : "border-[#E8E8E8]"
                    } hover:bg-[#FF8906] hover:text-white transition text-xs sm:text-sm md:text-base`}>
                    {orderMethod.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CartPage;
