export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (item) => {
  const cart = getCart();

  const existingItemIndex = cart.findIndex(
    (cartItem) =>
      cartItem.menuId === item.menuId &&
      cartItem.size === item.size &&
      cartItem.hotIce === item.hotIce
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += item.quantity;
  } else {
    cart.push({
      ...item,
      cartId: Date.now(),
    });
  }

  saveCart(cart);
  return cart;
};

export const removeFromCart = (cartId) => {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.cartId !== cartId);
  saveCart(updatedCart);
  return updatedCart;
};

export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const clearCart = () => {
  localStorage.removeItem("cart");
  return [];
};
