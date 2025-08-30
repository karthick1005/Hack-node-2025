import React from 'react';

const Card = ({ children, className = '', onClick }) => (
  <div 
    className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export default Card;