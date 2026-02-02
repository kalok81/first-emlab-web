import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 active:scale-95 hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none shadow-lg';
  
  const variants = {
    primary: 'bg-primary text-white shadow-primary/20 hover:bg-primary/90',
    secondary: 'bg-secondary text-primary shadow-secondary/20 hover:bg-secondary/90',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/5 shadow-none',
    danger: 'bg-highlight text-white shadow-highlight/20 hover:bg-highlight/90',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/80 backdrop-blur-md border-none shadow-soft rounded-3xl p-6 ${className}`}>
      {children}
    </div>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return (
    <input 
      className={`w-full p-4 bg-white/50 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400 ${className}`}
      {...props}
    />
  );
};

export const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <label className={`text-xs font-bold text-primary/70 uppercase tracking-wider mb-2 block ${className}`}>
      {children}
    </label>
  );
};
