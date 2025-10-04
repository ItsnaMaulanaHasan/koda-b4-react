function Button({ type, className, children, onCLick }) {
  return (
    <button type={type} onClick={onCLick} className={`w-full py-2 rounded-md cursor-pointer ${className}`}>
      {children}
    </button>
  );
}

export default Button;
