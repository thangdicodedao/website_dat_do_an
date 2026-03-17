import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductState, ProductsQuery } from '../../types';
import { productAPI } from '../../services';

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  recommendedProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ query }: { query?: ProductsQuery } = {}, { rejectWithValue }) => {
    try {
      const result = await productAPI.getProducts(query);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const product = await productAPI.getProductById(id);
      return product;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const products = await productAPI.getFeaturedProducts();
      return products;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecommendedProducts = createAsyncThunk(
  'products/fetchRecommended',
  async ({ productId }: { productId?: string } = {}, { rejectWithValue }) => {
    try {
      const products = await productAPI.getRecommendedProducts(productId);
      return products;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNewProducts = createAsyncThunk(
  'products/fetchNew',
  async (_, { rejectWithValue }) => {
    try {
      const products = await productAPI.getNewProducts();
      return products;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Featured
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Recommended
      .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
        state.recommendedProducts = action.payload;
      })
      // Fetch New
      .addCase(fetchNewProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      });
  },
});

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
