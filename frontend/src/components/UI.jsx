import React from 'react';

export const Button = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  isLoading = false,
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-success hover:bg-green-600 text-white',
    danger: 'bg-error hover:bg-red-600 text-white',
    outline: 'border-2 border-primary text-primary hover:bg-primary-light',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
};

export const Input = ({ 
  label, 
  error, 
  className = '', 
  required = false,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent ${error ? 'border-error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
};

export const Select = ({ 
  label, 
  error, 
  options = [], 
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent ${error ? 'border-error' : ''} ${className}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
};

export const Card = ({ children, className = '', title, subtitle }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-primary-light text-primary',
    success: 'bg-green-100 text-success',
    warning: 'bg-yellow-100 text-warning',
    error: 'bg-red-100 text-error',
    gray: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const SummaryCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-blue-50 text-primary border-blue-200',
    success: 'bg-green-50 text-success border-green-200',
    warning: 'bg-yellow-50 text-warning border-yellow-200',
    error: 'bg-red-50 text-error border-red-200',
  };

  return (
    <Card className={`border-l-4 border-${color} ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-${color}`}>
            <Icon size={24} className={`text-${color}`} />
          </div>
        )}
      </div>
    </Card>
  );
};
