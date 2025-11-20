import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { cartReducer } from "./cart";
import { orderReducer } from "./order";
import { profileReducer } from "./profile";

const persistCartConfig = {
  key: "cart",
  storage,
};

const persistOrderConfig = {
  key: "order",
  storage,
};

const persistProfileConfig = {
  key: "profile",
  storage,
};

const reducer = combineReducers({
  cart: persistReducer(persistCartConfig, cartReducer),
  order: persistReducer(persistOrderConfig, orderReducer),
  profile: persistReducer(persistProfileConfig, profileReducer),
});

export default reducer;
