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
                className='border border-silverMist rounded-md focus:border-electricBlue focus:outline-none w-full px-4 py-3 transition-all'
            /> 
        </div>
    )
}

export default Input