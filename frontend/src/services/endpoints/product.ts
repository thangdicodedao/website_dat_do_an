import { mockApi } from '../api';
import { Product, ProductsQuery, ProductsResponse, Category, Review, CreateReviewData } from '../../types';
import { products, categories, reviews as allReviews } from '../../data';

export const productAPI = {
  getProducts: async (query?: ProductsQuery): Promise<ProductsResponse> => {
    await mockApi.delay(600);

    let filteredProducts = [...products];

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

    return product;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    await mockApi.delay(400);
    return products.filter(p => p.isFeatured);
  },

  getRecommendedProducts: async (productId?: string): Promise<Product[]> => {
    await mockApi.delay(400);

    let filtered = products.filter(p => p.id !== productId);

    // Randomize and return 8 products
    return filtered
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
  },

  getNewProducts: async (): Promise<Product[]> => {
    await mockApi.delay(400);
    return products.filter(p => p.isNew);
  },

  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    await mockApi.delay(400);
    return products.filter(p => p.categoryId === categoryId);
  },

  // Admin functions
  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    await mockApi.delay(800);

    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    await mockApi.delay(600);

    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Sản phẩm không tồn tại');
    }

    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

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
    await mockApi.delay(400);
    return categories;
  },

  getCategoryById: async (id: string): Promise<Category> => {
    await mockApi.delay(300);

    const category = categories.find(c => c.id === id);
    if (!category) {
      throw new Error('Danh mục không tồn tại');
    }

    return category;
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    await mockApi.delay(300);

    const category = categories.find(c => c.slug === slug);
    if (!category) {
      throw new Error('Danh mục không tồn tại');
    }

    return category;
  },

  // Admin functions
  createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    await mockApi.delay(600);

    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };

    categories.push(newCategory);
    return newCategory;
  },

  updateCategory: async (id: string, updates: Partial<Category>): Promise<Category> => {
    await mockApi.delay(500);

    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Danh mục không tồn tại');
    }

    categories[index] = { ...categories[index], ...updates };
    return categories[index];
  },

  deleteCategory: async (id: string): Promise<void> => {
    await mockApi.delay(400);

    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Danh mục không tồn tại');
    }

    categories.splice(index, 1);
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
