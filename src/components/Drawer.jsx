import { useEffect } from "react";

function Drawer({
  drawerCtx,
  bg,
  textColor,
  children,
  direction = "left",
  width = "w-80",
}) {
  useEffect(() => {
    if (drawerCtx.showDrawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [drawerCtx.showDrawer]);

  if (!drawerCtx.showDrawer) {
    return null;
  }

  const getDrawerConfig = () => {
    if (direction === "right") {
      return {
        position: "top-0 right-0",
        translate: drawerCtx.showDrawer ? "translate-x-0" : "translate-x-full",
      };
    }
    return {
      position: "top-0 left-0",
      translate: drawerCtx.showDrawer ? "translate-x-0" : "-translate-x-full",
    };
  };

  const { position, translate } = getDrawerConfig();

  return (
    <>
      <div className="fixed inset-0 overflow-hidden z-201">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => drawerCtx.setShowDrawer(false)}
        />

        {/* Drawer */}
        <div
          className={`fixed ${position} z-2002 h-dvh p-4 overflow-y-auto transition-transform ${bg} ${textColor} ${width} ${translate}`}
          tabIndex="-1">
          {children}
        </div>
      </div>
    </>
  );
}

export default Drawer;
