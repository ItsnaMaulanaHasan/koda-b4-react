import { createContext } from "react";

export const AuthContext = createContext({
  accessToken: "",
  setAccessToken: function () {},
});
