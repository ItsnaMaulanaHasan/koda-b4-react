import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import reducer from "./reducers";

export const store = configureStore({
  reducer,
  middleware: (defaultMiddleWare) =>
    defaultMiddleWare({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
