import { mockApi } from '../api';
import { Order, OrderStatus, CreateOrderData } from '../../types';
import { orders as allOrders } from '../../data';
import { cartAPI } from './cart';

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  return `ORD-${timestamp}`;
};

export const orderAPI = {
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    await mockApi.delay(1000);

    // Get cart items
    const cart = await cartAPI.getCart();

    if (cart.items.length === 0) {
      throw new Error('Giỏ hàng trống');
    }

    // Get user info
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // Create order items from cart
    const orderItems = cart.items.map(item => ({
      productId: item.productId,
      productName: item.product.name,
      productImage: item.product.images[0],
      price: item.price,
      quantity: item.quantity,
      notes: item.notes,
    }));

    const subtotal = cart.subtotal;
    const tax = cart.tax;
    const total = cart.total;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      userId: data.userId,
      userName: user?.name || 'Khách vãng lai',
      userPhone: user?.phone || '',
      userEmail: user?.email || '',
      deliveryAddress: data.deliveryAddress,
      tableId: data.tableId,
      tableName: data.tableId ? `Bàn ${data.tableId.split('-')[1]}` : undefined,
      items: orderItems,
      subtotal,
      tax,
      discount: cart.discount,
      total,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'pending',
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    allOrders.push(newOrder);

    // Clear cart after order
    await cartAPI.clearCart();

    return newOrder;
  },

  getOrders: async (userId?: string): Promise<Order[]> => {
    await mockApi.delay(500);

    if (userId) {
      return allOrders.filter(o => o.userId === userId);
    }
    return [...allOrders];
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    await mockApi.delay(400);

    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Đơn hàng không tồn tại');
    }

    return order;
  },

  getOrdersByStatus: async (status: OrderStatus): Promise<Order[]> => {
    await mockApi.delay(400);
    return allOrders.filter(o => o.orderStatus === status);
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    await mockApi.delay(500);

    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Đơn hàng không tồn tại');
    }

    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();

    return order;
  },

  cancelOrder: async (orderId: string): Promise<Order> => {
    await mockApi.delay(500);

    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Đơn hàng không tồn tại');
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      throw new Error('Không thể hủy đơn hàng này');
    }

    order.orderStatus = 'cancelled';
    order.updatedAt = new Date().toISOString();

    return order;
  },

  getAllOrders: async (): Promise<Order[]> => {
    await mockApi.delay(400);
    return [...allOrders];
  },
};
