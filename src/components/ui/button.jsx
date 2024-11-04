import * as React from "react";

const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white";
    
    const variants = {
      default: "bg-gray-900 text-gray-50 hover:bg-gray-900/90",
      outline: "border border-gray-200 hover:bg-gray-100",
      ghost: "hover:bg-gray-100",
      link: "underline-offset-4 hover:underline",
    };
    
    const sizes = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
    };
    
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };