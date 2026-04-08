import React from 'react'

// 1. Pass 'props' as the single argument
const Button = (props) => {

    // 2. Destructure the variables from props 
    const { children, onClick, type = "submit" } = props;

    return (
        <div>
            <button
                type={type}
                onClick={onClick}
                className='w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 px-6 rounded-md 
            hover:from-blue-700 hover:to-blue-900 
                active:scale-[0.98] active:scale-95 transition-all duration-200 
            shadow-md hover:shadow-lg mt-4'>
                {children}</button>
        </div>
    )
}

export default Button