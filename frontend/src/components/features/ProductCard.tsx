import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Flame } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils';
import RatingStars from '../common/RatingStars';
import { useAppDispatch } from '../../hooks';
import { addToCart } from '../../store/slices/cartSlice';
import { useToast } from '../common/Toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
    showToast('success', `Đã thêm ${product.name} vào giỏ hàng`);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-lg">
              Mới
            </span>
          )}
          {product.originalPrice && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-lg">
              Giảm {Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="p-2 bg-white rounded-xl shadow-md hover:bg-red-50 transition-colors">
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            disabled={!product.isAvailable}
            className="w-full py-2.5 bg-red-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
            Thêm vào giỏ
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>
          {product.preparationTime <= 15 && (
            <div className="flex items-center gap-1 text-red-500 shrink-0">
              <Flame className="w-4 h-4" />
              <span className="text-xs">{product.preparationTime}p</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <RatingStars rating={product.rating} size="sm" />
          <span className="text-sm text-gray-500">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-red-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
