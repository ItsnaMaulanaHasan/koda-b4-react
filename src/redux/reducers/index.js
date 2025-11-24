import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { cartReducer } from "./cart";
import { profileReducer } from "./profile";

const persistCartConfig = {
  key: "cart",
  storage,
};

const persistProfileConfig = {
  key: "profile",
  storage,
};

const reducer = combineReducers({
  cart: persistReducer(persistCartConfig, cartReducer),
  profile: persistReducer(persistProfileConfig, profileReducer),
});

export default reducer;
