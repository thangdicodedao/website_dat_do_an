import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Utensils, Truck, Star, Clock } from 'lucide-react';
import { ProductCard, CategoryCard, HeroSlider } from '../../components/features';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchFeaturedProducts, fetchNewProducts } from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { featuredProducts, products: newProducts } = useAppSelector(
    (state) => state.products
  );
  const { categories } = useAppSelector((state) => state.categories);

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

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Features */}
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-3 md:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-2xl text-center hover:bg-red-50 transition-colors"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center text-red-500">
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
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="container mx-auto px-3 md:px-4">
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
              className="hidden sm:flex items-center gap-2 text-red-500 font-medium hover:text-red-600 transition-colors"
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
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-3 md:px-4">
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
              className="hidden sm:flex items-center gap-2 text-red-500 font-medium hover:text-red-600 transition-colors"
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
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="container mx-auto px-3 md:px-4">
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
              className="hidden sm:flex items-center gap-2 text-red-500 font-medium hover:text-red-600 transition-colors"
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
      <section className="py-12 md:py-20 bg-linear-to-r from-red-500 to-red-600">
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            Khám phá menu
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
