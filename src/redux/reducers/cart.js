import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataCarts: [],
};

const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addDataCart: (state, action) => {
      const existingItemIndex = state.dataCarts.findIndex(
        (cartItem) =>
          cartItem.menuId === action.payload.menuId &&
          cartItem.size === action.payload.size &&
          cartItem.hotIce === action.payload.hotIce
      );

      if (existingItemIndex > -1) {
        state.dataCarts[existingItemIndex].quantity += action.payload.quantity;
      } else {
        state.dataCarts.push({
          ...action.payload,
          cartId: Date.now(),
        });
      }
    },
    removeDataCart: (state, action) => {
      state.dataCarts = state.dataCarts.filter(
        (cart) => cart.cartId !== action.payload
      );
    },
    clearDataCart: (state) => {
      state.dataCarts = [];
    },
  },
});

export const {
  reducer: cartReducer,
  actions: { addDataCart, removeDataCart, clearDataCart },
} = cart;
