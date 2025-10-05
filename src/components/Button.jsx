function Button({ type, className, children, onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-2 rounded-md cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
