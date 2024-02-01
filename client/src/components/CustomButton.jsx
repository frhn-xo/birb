import React from 'react';

const CustomButton = ({ title, containerStyles, iconRight, onClick }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className={`inline-flex items-center ${containerStyles}`}
    >
      {title}
      {iconRight && <div className="ml-2">{iconRight}</div>}
    </button>
  );
};

export default CustomButton;
