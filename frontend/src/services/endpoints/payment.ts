import { mockApi } from '../api';
import { Payment, CreatePaymentData } from '../../types';
import { orderAPI } from './order';

export const paymentAPI = {
  createPayment: async (data: CreatePaymentData): Promise<{ payment: Payment; paymentUrl?: string }> => {
    await mockApi.delay(800);

    // Get order
    const order = await orderAPI.getOrderById(data.orderId);

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      orderId: data.orderId,
      amount: order.total,
      method: data.method,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    if (data.method === 'vnpay') {
      // Mock VNPAY payment URL
      const vnpayUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?amount=${order.total}&orderInfo=${order.orderNumber}`;
      payment.paymentUrl = vnpayUrl;
      payment.transactionId = `VNP${Date.now()}`;
    }

    return { payment, paymentUrl: payment.paymentUrl };
  },

  verifyPayment: async (orderId: string, transactionId?: string): Promise<Payment> => {
    await mockApi.delay(600);

    // Mock payment verification
    const payment: Payment = {
      id: `pay-${Date.now()}`,
      orderId,
      amount: 0, // Will be fetched from order
      method: 'vnpay',
      status: 'paid',
      transactionId: transactionId || `VNP${Date.now()}`,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    };

    // Update order payment status
    await orderAPI.updateOrderStatus(orderId, 'confirmed');

    return payment;
  },

  refundPayment: async (orderId: string): Promise<Payment> => {
    await mockApi.delay(1000);

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      orderId,
      amount: 0,
      method: 'vnpay',
      status: 'refunded',
      transactionId: `REF${Date.now()}`,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    };

    return payment;
  },

  getPaymentByOrder: async (orderId: string): Promise<Payment | null> => {
    await mockApi.delay(400);

    // Mock: return a payment for the order
    return {
      id: `pay-${Date.now()}`,
      orderId,
      amount: 0,
      method: 'cod',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  },
};

// Mock VNPAY callback handler
export const handleVnpayCallback = (vnp_ResponseCode: string, _vnp_TxnRef: string) => {
  if (vnp_ResponseCode === '00') {
    return { success: true, message: 'Thanh toán thành công' };
  }
  return { success: false, message: 'Thanh toán thất bại' };
};
