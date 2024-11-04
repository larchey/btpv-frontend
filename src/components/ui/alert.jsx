const Alert = ({ className = "", variant = "default", ...props }) => {
    const variants = {
      default: "bg-gray-100 text-gray-900",
      destructive: "bg-red-100 text-red-900",
    };
  
    return (
      <div
        role="alert"
        className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-gray-950 ${variants[variant]} ${className}`}
        {...props}
      />
    );
  };
  
  const AlertTitle = ({ className = "", ...props }) => {
    return (
      <h5
        className={`mb-1 font-medium leading-none tracking-tight ${className}`}
        {...props}
      />
    );
  };
  
  const AlertDescription = ({ className = "", ...props }) => {
    return (
      <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props} />
    );
  };
  
  export { Alert, AlertTitle, AlertDescription };