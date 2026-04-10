import api, { mockApi } from '../api';
import { Product, ProductVariant, ProductsQuery, ProductsResponse, Category, Review, CreateReviewData } from '../../types';
import { products, reviews as allReviews } from '../../data';

const ensureProductVariants = (product: Product): Product => {
  const fallbackVariant: ProductVariant = {
    id: `${product.id}-default`,
    name: 'Mặc định',
    originalPrice: product.originalPrice ?? product.price,
    salePrice: product.price,
    quantity: product.isAvailable ? 100 : 0,
  };

  const variants = (product.variants && product.variants.length > 0
    ? product.variants
    : [fallbackVariant]
  ).map((variant, index) => ({
    ...variant,
    id: variant.id || `${product.id}-variant-${index + 1}`,
  }));

  const salePrices = variants.map((variant) => variant.salePrice);
  const originalPrices = variants.map((variant) => variant.originalPrice);
  const minSalePrice = salePrices.length > 0 ? Math.min(...salePrices) : product.price;
  const maxOriginalPrice = originalPrices.length > 0 ? Math.max(...originalPrices) : (product.originalPrice ?? minSalePrice);
  const totalQuantity = variants.reduce((sum, variant) => sum + variant.quantity, 0);

  return {
    ...product,
    variants,
    price: minSalePrice,
    originalPrice: maxOriginalPrice > minSalePrice ? maxOriginalPrice : undefined,
    isAvailable: totalQuantity > 0 && product.isAvailable !== false,
  };
};

export const productAPI = {
  getProducts: async (query?: ProductsQuery): Promise<ProductsResponse> => {
    await mockApi.delay(600);

    let filteredProducts = products.map(ensureProductVariants);

    // Filter by category
    if (query?.categoryId) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === query.categoryId);
    }

    // Filter by search
    if (query?.search) {
      const searchLower = query.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    // Filter by price range
    if (query?.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= query.minPrice!);
    }
    if (query?.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= query.maxPrice!);
    }

    // Filter by availability
    if (query?.isAvailable !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.isAvailable === query.isAvailable);
    }

    // Sort
    if (query?.sortBy) {
      filteredProducts.sort((a, b) => {
        let comparison = 0;
        switch (query.sortBy) {
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'rating':
            comparison = b.rating - a.rating;
            break;
          case 'createdAt':
            comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            break;
        }
        return query.sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    // Pagination
    const page = query?.page || 1;
    const limit = query?.limit || 12;
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    return {
      products: paginatedProducts,
      total,
      page,
      totalPages,
    };
  },

  getProductById: async (id: string): Promise<Product> => {
    await mockApi.delay(400);

    const product = products.find(p => p.id === id);
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    return ensureProductVariants(product);
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    await mockApi.delay(400);
    return products.filter(p => p.isFeatured).map(ensureProductVariants);
  },

  getRecommendedProducts: async (productId?: string): Promise<Product[]> => {
    await mockApi.delay(400);

    let filtered = products.filter(p => p.id !== productId).map(ensureProductVariants);

    // Randomize and return 8 products
    return filtered
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
  },

  getNewProducts: async (): Promise<Product[]> => {
    await mockApi.delay(400);
    return products.filter(p => p.isNew).map(ensureProductVariants);
  },

  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    await mockApi.delay(400);
    return products.filter(p => p.categoryId === categoryId).map(ensureProductVariants);
  },

  // Admin functions
  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    await mockApi.delay(800);

    const newProduct: Product = ensureProductVariants({
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    products.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    await mockApi.delay(600);

    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Sản phẩm không tồn tại');
    }

    products[index] = ensureProductVariants({
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return products[index];
  },

  deleteProduct: async (id: string): Promise<void> => {
    await mockApi.delay(500);

    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Sản phẩm không tồn tại');
    }

    products.splice(index, 1);
  },
};

export const categoryAPI = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data.data.categories;
  },

  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories/all');
    return response.data.data.categories;
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data.data.category;
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data.data.category;
  },

  createCategory: async (data: Omit<Category, 'id'>): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data.data.category;
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data.category;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

export const reviewAPI = {
  getReviewsByProduct: async (productId: string): Promise<{ reviews: Review[]; averageRating: number; totalReviews: number }> => {
    await mockApi.delay(400);

    const productReviews = allReviews.filter(r => r.productId === productId);
    const totalReviews = productReviews.length;
    const averageRating = totalReviews > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    return {
      reviews: productReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
    };
  },

  addReview: async (data: CreateReviewData, userId: string, userName: string, userAvatar?: string): Promise<Review> => {
    await mockApi.delay(800);

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: data.productId,
      userId,
      userName,
      userAvatar,
      rating: data.rating,
      title: data.title,
      content: data.content,
      images: data.images,
      isVerified: true,
      helpful: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    allReviews.push(newReview);
    return newReview;
  },

  markHelpful: async (reviewId: string): Promise<void> => {
    await mockApi.delay(300);

    const review = allReviews.find(r => r.id === reviewId);
    if (review) {
      review.helpful += 1;
    }
  },
};
