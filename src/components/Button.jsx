function Button({ type, className, children }) {
  return (
    <button type={type} className={`w-full py-2 rounded-md cursor-pointer ${className}`}>
      {children}
    </button>
  );
}

export default Button;
