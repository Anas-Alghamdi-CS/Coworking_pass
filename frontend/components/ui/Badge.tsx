import React from 'react';

export interface BadgeProps {
  variant?: 'eucalyptus' | 'soot' | 'mist' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'eucalyptus',
  children,
  className = '',
}) => {
  const styles = {
    eucalyptus: 'bg-eucalyptus/20 text-soot border-eucalyptus/30 font-semibold',
    soot: 'bg-soot text-plaster border-soot-light/30 font-medium',
    mist: 'bg-mist-light text-soot border-mist font-medium',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold',
    warning: 'bg-amber-50 text-amber-900 border-amber-300 font-semibold',
    danger: 'bg-rose-50 text-rose-800 border-rose-300 font-semibold',
    info: 'bg-mist/30 text-soot border-mist font-semibold',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
