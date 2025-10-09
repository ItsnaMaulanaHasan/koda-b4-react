import { createContext } from "react";

export const AuthContext = createContext({
  userLogin: null,
  setUserLogin: function () {},
});
