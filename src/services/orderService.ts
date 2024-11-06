import { orderAPI } from './api';

export interface OrderData {
  id: string;
  userId: string;
  eventId: string;
  tickets: {
    type: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
}

export interface TicketData {
  id: string;
  orderId: string;
  eventId: string;
  type: string;
  qrCode: string;
  status: 'valid' | 'used' | 'cancelled';
}

class OrderService {
  async createOrder(orderData: Omit<OrderData, 'id' | 'status' | 'createdAt'>): Promise<OrderData> {
    const response = await orderAPI.create(orderData);
    return response.data;
  }

  async getOrderById(id: string): Promise<OrderData> {
    const response = await orderAPI.getById(id);
    return response.data;
  }

  async getUserOrders(): Promise<OrderData[]> {
    const response = await orderAPI.getUserOrders();
    return response.data;
  }

  async updateOrderStatus(id: string, status: OrderData['status']): Promise<OrderData> {
    const response = await orderAPI.updateStatus(id, status);
    return response.data;
  }

  async getOrderTickets(id: string): Promise<TicketData[]> {
    const response = await orderAPI.getTickets(id);
    return response.data;
  }

  async processPayment(
    orderId: string,
    paymentData: {
      method: string;
      amount: number;
      currency: string;
      details: any;
    }
  ): Promise<{ success: boolean; transactionId?: string }> {
    try {
      // In a real app, this would integrate with a payment gateway
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      return { success: true, transactionId: `TX-${Date.now()}` };
    } catch (error) {
      console.error('Payment processing error:', error);
      return { success: false };
    }
  }
}

export const orderService = new OrderService();