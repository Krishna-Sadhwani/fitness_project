import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div className={`rounded-2xl bg-white p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card;
