import React from 'react'

// 1. Pass 'props' as the single argument
const Button = (props) => {
    
    // 2. Destructure the variables from props 
    const { children , onClick , type = "button"} = props;

    return (
        <div>
           <button 
           type = {type} 
           onClick={onClick}
           className='w-full bg-electricBlue text-white font-bold py-3 px-6 rounded-md 
            hover:bg-blue-600 active:scale-95 transition-all duration-200 
            shadow-md hover:shadow-lg mt-4'>
            {children}</button>
        </div>
    )
}

export default Button