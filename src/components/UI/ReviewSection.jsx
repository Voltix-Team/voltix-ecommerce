import { useState, useEffect, useContext } from 'react';
import { Star } from 'lucide-react';
import StarRating from './StarRating';
import { UserContext } from '../../pages/UserContext';

// Interactive star picker
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

const ReviewSection = ({ productId, apiReviews = [] }) => {
    const { user } = useContext(UserContext);
    const STORAGE_KEY = `voltix_reviews_${productId}`;

    const [userReviews, setUserReviews] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [rating, setRating]   = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError]     = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userReviews));
    }, [userReviews, STORAGE_KEY]);

    // merge user reviews + api reviews for display
    const allReviews = [
        ...userReviews,
        ...apiReviews.map(r => ({
            name: r.reviewerName,
            avatar: null,
            rating: r.rating,
            comment: r.comment,
            date: new Date(r.date).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            }),
            isApi: true,
        }))
    ];

    const avgRating = allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    const handleSubmit = () => {
        if (rating === 0) { setError('Please select a star rating'); return; }
        if (!comment.trim()) { setError('Please write something'); return; }
        if (comment.trim().length < 5) { setError('Review is too short'); return; }

        const newReview = {
            name:    user.name,
            avatar:  user.avatar,
            rating,
            comment: comment.trim(),
            date:    new Date().toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            }),
            isApi: false,
        };

        setUserReviews(prev => [newReview, ...prev]);
        setRating(0);
        setComment('');
        setError('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="bg-white p-8 rounded-3xl space-y-8">

            {/* header — average rating */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
                {allReviews.length > 0 ? (
                    <div className="flex items-center gap-4">
                        <StarRating rating={avgRating} totalRatings={allReviews.length} size={6} />
                        <span className="text-sm text-gray-400">Average rating</span>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No reviews yet — be the first!</p>
                )}
            </div>

            {/* write a review */}
            <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-5">
                    Write a Review
                </h4>

                {user ? (
                    <div className="space-y-4">
                        {/* logged-in user info — pulled from context */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-blue-200">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-blue-600 font-bold text-sm">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                <p className="text-[11px] text-gray-400">{user.email}</p>
                            </div>
                        </div>

                        {/* star picker */}
                        <StarPicker value={rating} onChange={v => { setRating(v); setError(''); }} />

                        {/* comment */}
                        <textarea
                            value={comment}
                            onChange={e => { setComment(e.target.value); setError(''); }}
                            placeholder="Share your experience with this product..."
                            rows={3}
                            className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none transition-all resize-none
                                ${error
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50'
                                }`}
                        />
                        {error && <p className="text-[11px] text-red-500">{error}</p>}

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
                            >
                                Submit Review
                            </button>
                            {submitted && (
                                <p className="text-sm font-semibold text-green-600">✓ Review submitted!</p>
                            )}
                        </div>
                    </div>
                ) : (
                    // not logged in
                    <div className="bg-gray-50 rounded-2xl p-6 text-center border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500 mb-3">
                            You need to be logged in to leave a review.
                        </p>
                        <a
                            href="/login"
                            className="text-sm font-bold text-blue-600 hover:underline"
                        >
                            Log in to review
                        </a>
                    </div>
                )}
            </div>

            {/* reviews list */}
            {allReviews.length > 0 && (
                <div className="border-t border-gray-100 pt-6 space-y-6">
                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        All Reviews ({allReviews.length})
                    </h4>
                    {allReviews.map((review, i) => (
                        <div key={i} className="flex gap-4">
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
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewSection;