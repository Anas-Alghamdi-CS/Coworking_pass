import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 ease-in-out active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-soot/15 disabled:opacity-50 disabled:pointer-events-none shadow-xs';
  
  const sizeStyles = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  const variants = {
    primary: 'bg-[#DDE6DF] text-soot hover:bg-[#D0DDD3] border border-soot/8',
    secondary: 'bg-white text-soot hover:bg-[#F4F6F4] border border-soot/15',
    outline: 'border border-soot/20 bg-transparent text-soot hover:bg-[#DDE6DF]/50',
    ghost: 'text-soot hover:bg-[#DDE6DF]/60 shadow-none',
    danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
