import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  amountCarts: 0,
};

const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setAmountCarts: (state, action) => {
      state.amountCarts = action.payload;
    },
    addAmountCarts: (state) => {
      state.amountCarts++;
    },
    reduceAmountCarts: (state) => {
      state.amountCarts--;
    },
    clearCarts: (state) => {
      state.amountCarts = 0;
    },
  },
});

export const {
  reducer: cartReducer,
  actions: { setAmountCarts, addAmountCarts, reduceAmountCarts, clearCarts },
} = cart;
