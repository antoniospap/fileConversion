import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  color?: 'blue' | 'green';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Button({
  onClick,
  children,
  color = 'blue',
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseClasses = 'py-2 px-4 rounded text-white';
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${colorClasses[color]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}