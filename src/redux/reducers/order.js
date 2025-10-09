import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  dataOrders: [],
};

const generateOrderNumber = () => {
  const date = moment(new Date());
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${date.format("DDMMYYYY")}-${random}`;
};

const order = createSlice({
  name: "order",
  initialState,
  reducers: {
    addDataOrder: (state, action) => {
      const user = localStorage.getItem("user");
      const userPhone = user ? JSON.parse(user).phone || "" : "";

      const newOrder = {
        noOrder: generateOrderNumber(),
        dateOrder: new Date().toISOString(),
        fullName: action.payload.fullName,
        email: action.payload.email,
        address: action.payload.address,
        phone: userPhone,
        paymentMethod: "Cash",
        shipping: action.payload.shipping,
        status: "On Progress",
        totalTransaction: action.payload.subTotal,
        listOrders: action.payload.listOrders,
        orderTotal: action.payload.orderTotal,
        deliveryFee: action.payload.deliveryFee,
        tax: action.payload.tax,
      };

      state.dataOrders.unshift(newOrder);
    },
  },
});

export const {
  reducer: orderReducer,
  actions: { addDataOrder },
} = order;
