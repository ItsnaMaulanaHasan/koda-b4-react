import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { cartReducer } from "./cart";
import { orderReducer } from "./order";

const persistCartConfig = {
  key: "cart",
  storage,
};

const persistOrderConfig = {
  key: "order",
  storage,
};

const reducer = combineReducers({
  cart: persistReducer(persistCartConfig, cartReducer),
  order: persistReducer(persistOrderConfig, orderReducer),
});

export default reducer;
