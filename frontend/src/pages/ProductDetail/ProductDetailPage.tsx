import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, Truck, Clock, Flame, AlertCircle } from 'lucide-react';
import { ProductGallery, ProductCard, ReviewCard } from '../../components/features';
import { Button, QuantitySelector, PageLoader, RatingStars } from '../../components/common';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProductById, fetchRecommendedProducts, clearCurrentProduct } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { reviewAPI } from '../../services';
import { formatPrice } from '../../utils';
import { Review } from '../../types';
import { useToast } from '../../components/common/Toast';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentProduct, recommendedProducts, loading } = useAppSelector((state) => state.products);
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchRecommendedProducts({ productId: id }));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct) {
      setReviewLoading(true);
      reviewAPI.getReviewsByProduct(currentProduct.id)
        .then((data) => {
          setReviews(data.reviews);
          setAverageRating(data.averageRating);
          setTotalReviews(data.totalReviews);
        })
        .finally(() => setReviewLoading(false));
    }
  }, [currentProduct]);

  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(addToCart({ productId: currentProduct.id, quantity }));
      showToast('success', `Đã thêm ${currentProduct.name} vào giỏ hàng`);
    }
  };

  if (loading || !currentProduct) {
    return <PageLoader />;
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-orange-500">Trang chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-orange-500">Sản phẩm</Link>
          <span>/</span>
          <Link to={`/products?category=${currentProduct.categoryName.toLowerCase()}`} className="hover:text-orange-500">
            {currentProduct.categoryName}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{currentProduct.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Gallery */}
          <ProductGallery images={currentProduct.images} video={currentProduct.video} />

          {/* Info */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {currentProduct.name}
                </h1>
                <div className="flex gap-2">
                  <button className="p-2.5 bg-gray-100 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 bg-gray-100 rounded-xl hover:bg-orange-50 hover:text-orange-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <RatingStars rating={Math.round(averageRating)} showNumber />
                <span className="text-gray-500">({totalReviews} đánh giá)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-orange-600">
                  {formatPrice(currentProduct.price)}
                </span>
                {currentProduct.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(currentProduct.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">{currentProduct.description}</p>

              {/* Info Icons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span>{currentProduct.preparationTime} phút</span>
                </div>
                {currentProduct.calories && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span>{currentProduct.calories} kcal</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="w-5 h-5 text-orange-500" />
                  <span>Giao hàng nhanh</span>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <QuantitySelector quantity={quantity} onChange={setQuantity} />
                <Button
                  onClick={handleAddToCart}
                  disabled={!currentProduct.isAvailable}
                  className="flex-1"
                  size="lg"
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>

              {/* Allergens Warning */}
              {currentProduct.allergens && currentProduct.allergens.length > 0 && (
                <div className="flex items-start gap-2 p-4 bg-yellow-50 rounded-xl text-sm text-yellow-800">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <strong>Cảnh báo:</strong> Sản phẩm có thể chứa {currentProduct.allergens.join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ingredients */}
        {currentProduct.ingredients && currentProduct.ingredients.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thành phần</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {currentProduct.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Đánh giá ({totalReviews})
            </h2>
          </div>

          {reviewLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <p className="text-gray-500">Chưa có đánh giá nào</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {displayedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
              {reviews.length > 3 && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                  >
                    {showAllReviews ? 'Thu gọn' : `Xem thêm ${reviews.length - 3} đánh giá`}
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Món ăn liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
