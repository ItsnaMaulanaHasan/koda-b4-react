import { createContext } from "react";

export const DrawerFilterContext = createContext({
  showDrawer: false,
  setShowDrawer: function () {},
});
