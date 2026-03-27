import React from 'react';

const Button = ({ children, variant = "primary", className = "", loading = false, ...props }) => {
  const variants = {
    primary: "bg-accent text-black font-bold hover:bg-[#9d66ff]",
    secondary: "bg-secondary text-white hover:bg-[#333333]",
    outline: "border border-accent text-accent hover:bg-accent hover:text-black",
    ghost: "text-gray-400 hover:text-white hover:bg-secondary",
  };

  return (
    <button
      disabled={loading}
      className={`px-6 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin" />
      ) : children}
    </button>
  );
};

export default Button;
