import React from 'react';

// Reusable Button component
// Width is controlled by the className prop passed from outside

const Button = (props) => {
    const { className = '', children, onClick, type = 'button' } = props;

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${className} bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 px-6 rounded-md 
                hover:from-blue-700 hover:to-blue-900 
                active:scale-95 transition-all duration-200 
                shadow-md hover:shadow-lg mt-4`}
        >
            {children}
        </button>
    );
};

export default Button;