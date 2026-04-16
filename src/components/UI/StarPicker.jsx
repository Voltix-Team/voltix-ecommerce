import { useState } from 'react';
import { Star } from 'lucide-react';

const StarPicker = ({ value, onChange }) => {
    const [hovered, setHovered] = useState(null);
    const active = hovered ?? value;

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(null)}
                    className="transition-transform hover:scale-110"
                    aria-label={`Rate ${star} stars`}
                >
                    <Star
                        className={`w-6 h-6 transition-colors ${
                            active >= star ? 'text-yellow-400' : 'text-gray-200'
                        }`}
                        fill="currentColor"
                    />
                </button>
            ))}
            {value > 0 && (
                <span className="ml-2 text-sm text-gray-500 font-medium">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}
                </span>
            )}
        </div>
    );
};

export default StarPicker;