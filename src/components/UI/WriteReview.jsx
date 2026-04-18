import { useState } from 'react';
import Button from './Button';
import StarPicker from './StarPicker';

const WriteReview = ({ user, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (rating === 0) { setError('Please select a star rating'); return; }
        if (!comment.trim()) { setError('Please write something'); return; }
        if (comment.trim().length < 5) { setError('Review is too short'); return; }

        onSubmit({ rating, comment: comment.trim() });

        setRating(0);
        setComment('');
        setError('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    if (!user) {
        return (
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
        );
    }

    return (
        <div className="space-y-4">
            {/* logged-in user info */}
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

            <StarPicker value={rating} onChange={v => { setRating(v); setError(''); }} />

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
                <Button onClick={handleSubmit}>Submit Review</Button>
                {submitted && (
                    <p className="text-sm font-semibold text-green-600">✓ Review submitted!</p>
                )}
            </div>
        </div>
    );
};

export default WriteReview;