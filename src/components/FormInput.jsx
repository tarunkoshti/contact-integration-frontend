import React from 'react';

/**
 * Reusable FormInput with support for labels, errors, and leading icons.
 */
export default function FormInput({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider text-slate-500"
        >
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-white border rounded-lg py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-colors duration-150
            ${Icon ? 'pl-10 pr-3.5' : 'px-3.5'}
            ${error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
              : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
            }`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-rose-600 font-medium tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
}
