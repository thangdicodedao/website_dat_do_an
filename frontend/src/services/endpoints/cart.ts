import { mockApi } from '../api';
import { Cart, CartItem, AddToCartData, UpdateCartItemData } from '../../types';
import { products } from '../../data';

let cartData: Cart = {
  id: 'cart-001',
  userId: undefined,
  tableId: undefined,
  items: [],
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const TAX_RATE = 0.045; // 4.5% VAT

const calculateCartTotals = () => {
  cartData.subtotal = cartData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartData.tax = Math.round(cartData.subtotal * TAX_RATE);
  cartData.total = cartData.subtotal + cartData.tax - cartData.discount;
  cartData.updatedAt = new Date().toISOString();
};

export const cartAPI = {
  getCart: async (userId?: string, tableId?: string): Promise<Cart> => {
    await mockApi.delay(300);

    // Simulate getting cart for specific user or table
    if (userId) {
      cartData.userId = userId;
    }
    if (tableId) {
      cartData.tableId = tableId;
    }

    return { ...cartData };
  },

  addToCart: async (data: AddToCartData): Promise<Cart> => {
    await mockApi.delay(400);

    const product = products.find(p => p.id === data.productId);
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    if (!product.isAvailable) {
      throw new Error('Sản phẩm hiện không có sẵn');
    }

    // Check if item already in cart
    const existingItem = cartData.items.find(item => item.productId === data.productId);

    if (existingItem) {
      existingItem.quantity += data.quantity;
      if (data.notes) {
        existingItem.notes = data.notes;
      }
    } else {
      const newItem: CartItem = {
        id: `cart-item-${Date.now()}`,
        productId: product.id,
        product,
        quantity: data.quantity,
        price: product.price,
        notes: data.notes,
      };
      cartData.items.push(newItem);
    }

    calculateCartTotals();
    return { ...cartData };
  },

  updateCartItem: async (data: UpdateCartItemData): Promise<Cart> => {
    await mockApi.delay(300);

    const item = cartData.items.find(i => i.id === data.cartItemId);
    if (!item) {
      throw new Error('Sản phẩm trong giỏ không tồn tại');
    }

    if (data.quantity <= 0) {
      // Remove item if quantity is 0 or less
      cartData.items = cartData.items.filter(i => i.id !== data.cartItemId);
    } else {
      item.quantity = data.quantity;
      if (data.notes !== undefined) {
        item.notes = data.notes;
      }
    }

    calculateCartTotals();
    return { ...cartData };
  },

  removeFromCart: async (cartItemId: string): Promise<Cart> => {
    await mockApi.delay(300);

    cartData.items = cartData.items.filter(i => i.id !== cartItemId);
    calculateCartTotals();
    return { ...cartData };
  },

  clearCart: async (): Promise<Cart> => {
    await mockApi.delay(300);

    cartData.items = [];
    calculateCartTotals();
    return { ...cartData };
  },

  applyCoupon: async (couponCode: string): Promise<{ cart: Cart; discount: number }> => {
    await mockApi.delay(500);

    // Mock coupon codes
    const coupons: Record<string, number> = {
      'WELCOME10': 10,
      'SAVE20': 20,
      'GIAM10K': 10000,
    };

    const discountPercent = coupons[couponCode.toUpperCase()];
    if (!discountPercent) {
      throw new Error('Mã giảm giá không hợp lệ');
    }

    // Calculate discount
    const discount = typeof discountPercent === 'number' && discountPercent < 100
      ? Math.round(cartData.subtotal * (discountPercent / 100))
      : discountPercent;

    cartData.discount = discount;
    calculateCartTotals();

    return { cart: { ...cartData }, discount };
  },
};
