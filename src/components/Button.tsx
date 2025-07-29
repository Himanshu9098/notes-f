import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'google';
  className?: string;
}

/**
 * Reusable button component with primary, secondary, and Google variants
 * @param props Button properties
 */
export default function Button({
  type = 'button',
  onClick,
  disabled,
  children,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  const baseStyles = 'w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200';
  const variantStyles = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    google: 'bg-gray-100 hover:bg-gray-200 text-gray-900 flex items-center justify-center gap-2',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {variant === 'google' && (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.649,9.393-11.305H12.545z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}