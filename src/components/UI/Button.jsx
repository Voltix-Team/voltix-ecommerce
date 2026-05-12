import React from 'react';

const Button = (props) => {
    const {
        className = '',           // extra classes you can pass from outside
        children,                  // what goes inside the button (text, icon, etc.)
        onClick,              
        type = 'button',          
        variant = 'primary',       // controls the style (primary or ghost)
        ...rest                    // catches any other props (disabled, etc.)
    } = props;

    // Base styles that are common to ALL buttons
    const baseClasses = "font-medium transition-all duration-200 active:scale-95";

    // Different style presets (variants)
    const variants = {
        //using this for the normal buttons
        primary: `bg-gradient-to-r from-blue-600 to-blue-800 text-white 
                hover:from-blue-700 hover:to-blue-900 
                py-3 px-6 rounded-md shadow-md hover:shadow-lg mt-4 font-bold`,

        //using this for the icon buttons
        ghost: `flex items-center gap-2 text-gray-700 hover:text-blue-600 
                hover:bg-gray-100 px-3 py-2 rounded-md`,

        // for icon-only buttons (clean and minimal)
        icon: `text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-md`,

        // for logout (red hover)
        danger: `text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-md`,

        // Rounded-full with a white background. Designed for "Add to Wishlist" or "Trash" overlays on images.
        favorite: `bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition-colors`,

        plain: "hover:bg-gray-50 transition-colors",

        paymentOption: `flex items-center gap-3 border-2 rounded-xl px-4 py-3.5 transition-all`,

        category: `px-6 py-3 rounded-2xl font-medium transition-all`,

        social: `flex-1 flex items-center justify-center gap-2 border border-slate-100 py-2 rounded-lg 
                text-[9px] font-bold text-slate-500 uppercase transition hover:bg-slate-50`,
  
        textLink: `text-[8px] font-bold text-blue-600 uppercase hover:text-blue-700 transition-colors`,
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${variants[variant]} ${baseClasses} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;