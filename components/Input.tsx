import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  multiline = false,
  ...props 
}) => {
  const baseStyles = 'w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : '';

  const Component = multiline ? 'textarea' : 'input';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <Component 
        className={`${baseStyles} ${errorStyles} ${className}`}
        {...(props as any)}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 font-bold">{error}</p>
      )}
    </div>
  );
};

export default Input;
