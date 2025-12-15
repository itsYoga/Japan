import React from 'react';

interface RetroCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  color?: 'white' | 'orange' | 'green' | 'blue';
}

const colorClasses = {
  white: 'bg-white',
  orange: 'bg-orange-50',
  green: 'bg-emerald-50',
  blue: 'bg-blue-50'
};

export const RetroCard: React.FC<RetroCardProps> = ({ children, className = '', onClick, color = 'white' }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        ${colorClasses[color]} 
        border-2 border-stone-800 
        rounded-2xl 
        shadow-retro 
        p-4 mb-4 
        transition-all duration-100
        ${onClick ? 'active:translate-x-[2px] active:translate-y-[2px] active:shadow-retro-active cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
