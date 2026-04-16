import StarRating from './StarRating';

const ReviewItem = ({ review }) => {
    return (
        <div className="flex gap-4">
            {/* avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {review.avatar ? (
                    <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-blue-600 font-bold text-sm">
                        {review.name?.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>

            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{review.name}</span>
                        {!review.isApi && (
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                Verified Purchase
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                </div>
                <StarRating rating={review.rating} size={4} />
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
            </div>
        </div>
    );
};

export default ReviewItem;