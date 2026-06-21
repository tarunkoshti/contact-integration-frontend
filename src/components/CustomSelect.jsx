import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  label,
  value,
  options = [],
  onChange,
  placeholder = '-- Select --',
  error,
  required = false,
  className = '',
  icon: Icon,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => String(opt.id) === String(value));

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`flex flex-col space-y-1.5 w-full relative ${className}`}>
      {label && (
        <span
          className="text-xs font-semibold uppercase tracking-wider text-slate-500"
        >
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </span>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white border rounded-lg py-2.5 text-left text-sm text-slate-800 focus:outline-none transition-all duration-150 flex items-center justify-between cursor-pointer
            ${Icon ? 'pl-10 pr-10' : 'px-3.5 pr-10'}
            ${error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
              : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
            }`}
        >
          <div className="flex items-center gap-2 overflow-hidden w-full">
            {Icon && (
              <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <span className={`truncate capitalize ${!selectedOption ? 'text-slate-400' : 'text-slate-800 font-medium'}`}>
              {selectedOption ? selectedOption.project_name : placeholder}
            </span>
          </div>
          <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 max-h-60 overflow-y-auto transform origin-top transition-all duration-200 scale-100 opacity-100 animate-in fade-in slide-in-from-top-1">
            {options.length === 0 ? (
              <div className="px-3.5 py-2 text-sm text-slate-400 italic">No options available</div>
            ) : (
              options.map((opt) => {
                const isSelected = String(opt.id) === String(value);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    className={`w-full text-left px-3.5 py-2 text-sm transition-colors duration-150 flex items-center justify-between cursor-pointer capitalize
                      ${isSelected 
                        ? 'bg-sky-50 text-sky-700 font-semibold' 
                        : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <span>{opt.project_name}</span>
                    {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs text-rose-600 font-medium tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
}
