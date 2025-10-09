import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { cartReducer } from "./cart";

const persistCartConfig = {
  key: "cart",
  storage,
};

const reducer = combineReducers({
  cart: persistReducer(persistCartConfig, cartReducer),
});

export default reducer;
