import { useContext } from "react";
import { DrawerFilterContext } from "../context/DrawerContext";

function Drawer({ children }) {
  const { showDrawer, setShowDrawer } = useContext(DrawerFilterContext);

  if (!showDrawer) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 overflow-hidden z-100">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setShowDrawer(false)}
        />

        {/* Drawer */}
        <div
          className={`fixed top-0 left-0 z-101 h-screen p-4 overflow-y-auto transition-transform bg-[#0B0909] text-white w-80 ${
            showDrawer ? "translate-x-0" : "-translate-x-full"
          }`}
          tabIndex="-1">
          {children}
        </div>
      </div>
    </>
  );
}

export default Drawer;
