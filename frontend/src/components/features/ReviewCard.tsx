import { ThumbsUp, CheckCircle } from 'lucide-react';
import { Review } from '../../types';
import { formatDate } from '../../utils';
import RatingStars from '../common/RatingStars';

interface ReviewCardProps {
  review: Review;
  onMarkHelpful?: (reviewId: string) => void;
}

export default function ReviewCard({ review, onMarkHelpful }: ReviewCardProps) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={review.userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
          alt={review.userName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900">{review.userName}</h4>
            {review.isVerified && (
              <span className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="w-3 h-3" />
                Đã mua hàng
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <RatingStars rating={review.rating} size="sm" />
            <span className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Title & Content */}
      {review.title && (
        <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
      )}
      <p className="text-gray-600 mb-3">{review.content}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onMarkHelpful?.(review.id)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Hữu ích ({review.helpful})</span>
        </button>
      </div>
    </div>
  );
}
