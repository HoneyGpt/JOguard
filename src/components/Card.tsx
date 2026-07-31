import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
  onClick,
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3.5',
    md: 'p-5',
    lg: 'p-6',
  };

  const cardStyle = hoverable ? 'glass-card-hover cursor-pointer' : 'glass-card';

  return (
    <div
      onClick={onClick}
      className={`${cardStyle} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
};
