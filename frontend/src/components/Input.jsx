import React from 'react';

const Input = ({ label, type = "text", placeholder, value, onChange, className = "", ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-secondary border border-transparent focus:border-accent rounded-lg py-2.5 px-4 outline-none transition-all placeholder:text-gray-500 text-white"
        {...props}
      />
    </div>
  );
};

export default Input;
