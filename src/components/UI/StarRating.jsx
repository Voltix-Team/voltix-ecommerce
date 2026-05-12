import { Star } from 'lucide-react';

// Display-only star rating — fills each star based on exact decimal
// e.g. 3.4 → 3 full stars + 4th star 40% filled + 5th empty
const StarRating = ({ rating = 0, totalRatings = 0, size = 6 }) => {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                    // fillPercent: how much of this star is filled (0–100)
                    const fillPercent = Math.min(1, Math.max(0, rating - (star - 1))) * 100;

                    return (
                        <div key={star} className={`relative w-${size} h-${size}`}>
                            {/* empty star base */}
                            <Star
                                className={`absolute inset-0 w-${size} h-${size} text-gray-200`}
                                fill="currentColor"
                            />
                            {/* filled overlay clipped to exact percentage */}
                            {fillPercent > 0 && (
                                <span
                                    className="absolute inset-0 overflow-hidden"
                                    style={{ width: `${fillPercent}%` }}
                                >
                                    <Star
                                        className={`w-${size} h-${size} text-yellow-400`}
                                        fill="currentColor"
                                    />
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {totalRatings > 0 && (
                <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-gray-900">
                        {rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-400">
                        ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
                    </span>
                </div>
            )}
        </div>
    );
};

export default StarRating;