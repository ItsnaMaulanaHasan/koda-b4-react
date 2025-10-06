import moment from "moment";

export const getOrderHistories = () => {
  const histories = localStorage.getItem("orderHistories");
  return histories ? JSON.parse(histories) : [];
};

const saveOrderHistories = (histories) => {
  localStorage.setItem("orderHistories", JSON.stringify(histories));
};

const generateOrderNumber = () => {
  const date = moment(new Date());
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${date.format("DDMMYYYY")}-${random}`;
};

export const addOrderToHistories = (orderData) => {
  const histories = getOrderHistories();

  const user = localStorage.getItem("user");
  const userPhone = user ? JSON.parse(user).phone || "" : "";

  const newOrder = {
    noOrder: generateOrderNumber(),
    dateOrder: new Date().toISOString(),
    fullName: orderData.fullName,
    email: orderData.email,
    address: orderData.address,
    phone: userPhone,
    paymentMethod: "Cash",
    shipping: orderData.shipping,
    status: "On Progress",
    totalTransaction: orderData.subTotal,
    listOrders: orderData.listOrders,
    orderTotal: orderData.orderTotal,
    deliveryFee: orderData.deliveryFee,
    tax: orderData.tax,
  };

  histories.unshift(newOrder);
  saveOrderHistories(histories);
  return newOrder;
};
