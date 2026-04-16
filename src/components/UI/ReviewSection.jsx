import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../pages/UserContext';
import StarRating from './StarRating';
import WriteReview from './WriteReview';
import ReviewItem from './ReviewItem';

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

    const handleReviewSubmit = ({ rating, comment }) => {
        const newReview = {
            name:    user.name,
            avatar:  user.avatar,
            rating,
            comment,
            date:    new Date().toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            }),
            isApi: false,
        };

        setUserReviews(prev => [newReview, ...prev]);
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

                <WriteReview user={user} onSubmit={handleReviewSubmit} />
            </div>

            {/* reviews list */}
            {allReviews.length > 0 && (
                <div className="border-t border-gray-100 pt-6 space-y-6">
                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        All Reviews ({allReviews.length})
                    </h4>
                    <div className="space-y-6">
                        {allReviews.map((review, i) => (
                            <ReviewItem key={i} review={review} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;