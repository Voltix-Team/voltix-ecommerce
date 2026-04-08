import React from 'react'

// 1. Pass 'props' as the single argument
const Input = (props) => {

    // 2. Destructure the variables from props 
    const { label, type, placeholder, name, value, onChange } = props;

    return (
        <div className="flex flex-col gap-1 mb-4">
            <label htmlFor={name} className='text-sm font-semibold text-deepCharcoal'>
                {label}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full border-b border-gray-200 py-2 bg-transparent focus:outline-none focus:border-electricBlue transition-all" />
        </div>
    )
}

export default Input