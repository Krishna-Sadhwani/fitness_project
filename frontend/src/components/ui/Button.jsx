import React from "react";

const Button = ({ children, className = "", variant = "solid", ...props }) => {
  const base = "px-4 py-2 rounded-lg font-semibold transition";
  const variants = {
    solid: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    ghost: "text-gray-600 hover:text-blue-600",
  };
  return (
    <button className={`${base} ${variants[variant] || ""} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
