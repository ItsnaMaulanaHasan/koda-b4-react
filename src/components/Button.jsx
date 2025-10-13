/**
 * Reusable Button component with custom styling
 * @param {Object} props - Component props
 * @param {'button'|'submit'|'reset'} [props.type='button'] - HTML button type
 * @param {string} [props.className=''] - Additional CSS classes for styling
 * @param {React.ReactNode} props.children - Content to be displayed inside the button
 * @param {Function} [props.onClick] - Callback function when button is clicked
 * @returns {JSX.Element} Button component
 */
function Button({ type, className, children, onClick, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 rounded-md cursor-pointer font-medium text-[#0B132A] ${className}`}>
      {children}
    </button>
  );
}

export default Button;
