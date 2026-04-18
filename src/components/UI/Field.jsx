import React from 'react';

const Field = ({ 
    label, 
    value, 
    onChange, 
    placeholder = '', 
    type = 'text', 
    name,
    error 
}) => {
    return (
        <div className="mb-5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                {label}
            </label>
            
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}                    
                placeholder={placeholder}
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm 
                    text-gray-800 placeholder-gray-300 outline-none transition-all
                    ${error 
                        ? 'border-red-300 bg-red-50 focus:border-red-400' 
                        : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-50'
                    }`}
            />
            
            {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default Field;