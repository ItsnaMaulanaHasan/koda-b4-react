import { createContext } from "react";

export const DrawerNavbarContext = createContext({
  showDrawer: false,
  setShowDrawer: function () {},
});

export const DrawerFilterContext = createContext({
  showDrawer: false,
  setShowDrawer: function () {},
});

export const DrawerAdminContext = createContext({
  showDrawer: false,
  setShowDrawer: function () {},
});
