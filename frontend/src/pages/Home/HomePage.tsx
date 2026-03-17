import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Utensils, Truck, Star, Clock } from 'lucide-react';
import { ProductCard, CategoryCard } from '../../components/features';
import { PageLoader } from '../../components/common';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchFeaturedProducts, fetchNewProducts } from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { featuredProducts, products: newProducts, loading: productLoading } = useAppSelector(
    (state) => state.products
  );
  const { categories, loading: categoryLoading } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchNewProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const features = [
    {
      icon: <Utensils className="w-8 h-8" />,
      title: 'Đồ ăn ngon',
      description: 'Chất lượng đảm bảo, hương vị đặc biệt',
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Giao hàng nhanh',
      description: 'Giao hàng tận nơi trong thời gian ngắn',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Đánh giá cao',
      description: 'Hàng nghìn khách hàng hài lòng',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Phục vụ 24/7',
      description: 'Sẵn sàng phục vụ mọi lúc',
    },
  ];

  if (productLoading || categoryLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-700" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Đồ ăn ngon
              <br />
              <span className="text-yellow-300">Giao hàng nhanh</span>
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Khám phá hàng trăm món ăn ngon từ các nhà hàng nổi tiếng.
              Đặt món ngay hôm nay để nhận ưu đãi hấp dẫn!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                Đặt ngay
              </Link>
              <Link
                to="/products?category=mon-chinh"
                className="px-8 py-4 bg-white/20 text-white rounded-xl font-semibold backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
              >
                Xem menu
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-white/70">Món ăn</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-white/70">Nhà hàng</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-white/70">Khách hàng</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-2xl text-center hover:bg-orange-50 transition-colors"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Danh mục món ăn
              </h2>
              <p className="text-gray-500 mt-2">
                Khám phá các món ăn đa dạng của chúng tôi
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-2 text-orange-500 font-medium hover:text-orange-600 transition-colors"
            >
              Xem tất cả
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Món nổi bật
              </h2>
              <p className="text-gray-500 mt-2">
                Những món ăn được yêu thích nhất
              </p>
            </div>
            <Link
              to="/products?sortBy=rating"
              className="hidden sm:flex items-center gap-2 text-orange-500 font-medium hover:text-orange-600 transition-colors"
            >
              Xem tất cả
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Món mới
              </h2>
              <p className="text-gray-500 mt-2">
                Thử ngay những món mới ra mắt
              </p>
            </div>
            <Link
              to="/products?isNew=true"
              className="hidden sm:flex items-center gap-2 text-orange-500 font-medium hover:text-orange-600 transition-colors"
            >
              Xem tất cả
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Đặt món ngay hôm nay!
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Trải nghiệm hương vị đặc biệt từ các món ăn ngon nhất.
            Giao hàng nhanh chóng tận nơi.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            Khám phá menu
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
