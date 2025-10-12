function Drawer({ drawerCtx, bg, textColor, children }) {
  if (!drawerCtx.showDrawer) {
    return null;
  }

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
          className={`fixed top-0 left-0 z-2002 h-screen p-4 overflow-y-auto transition-transform ${bg} ${textColor}  w-80 ${
            drawerCtx.showDrawer ? "translate-x-0" : "-translate-x-full"
          }`}
          tabIndex="-1">
          {children}
        </div>
      </div>
    </>
  );
}

export default Drawer;
