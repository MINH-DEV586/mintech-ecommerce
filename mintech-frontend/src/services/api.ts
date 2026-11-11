import { apiClient } from '../lib/axios';
import { Product, Category, Brand, Order, User, Coupon, Review, ProductVariant } from '../types';

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post<{ accessToken: string; tokenType: string }>('/api/v1/auth/login', data);
    return res.data;
  },
  register: async (data: { fullName: string; email: string; phone?: string; password: string }) => {
    const res = await apiClient.post<User>('/api/v1/auth/register', data);
    return res.data;
  },
  getMe: async (token: string) => {
    const res = await apiClient.get<User>('/api/v1/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

export const productApi = {
  getAll: async () => {
    const res = await apiClient.get<Product[]>('/api/v1/products');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get<Product>(`/api/v1/products/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await apiClient.post<Product>('/api/v1/products', data);
    return res.data;
  },
  update: async (id: string, data: any) => {
    const res = await apiClient.put<Product>(`/api/v1/products/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/api/v1/products/${id}`);
  },
};

export const variantApi = {
  getByProduct: async (productId: string) => {
    const res = await apiClient.get<ProductVariant[]>(`/api/v1/products/${productId}/variants`);
    return res.data;
  },
  create: async (productId: string, data: any) => {
    const res = await apiClient.post<ProductVariant>(`/api/v1/products/${productId}/variants`, data);
    return res.data;
  },
  update: async (productId: string, variantId: string, data: any) => {
    const res = await apiClient.put<ProductVariant>(`/api/v1/products/${productId}/variants/${variantId}`, data);
    return res.data;
  },
  delete: async (productId: string, variantId: string) => {
    await apiClient.delete(`/api/v1/products/${productId}/variants/${variantId}`);
  },
};

export const categoryApi = {
  getAll: async () => {
    const res = await apiClient.get<Category[]>('/categories/all');
    return res.data;
  },
  create: async (data: { name: string; slug: string; description?: string; imageUrl?: string; parentId?: string }) => {
    const res = await apiClient.post<Category>('/categories/create', data);
    return res.data;
  },
  update: async (id: string, data: any) => {
    const res = await apiClient.put<Category>(`/categories/update/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/categories/delete/${id}`);
  },
};

export const brandApi = {
  getAll: async () => {
    const res = await apiClient.get<Brand[]>('/api/v1/brands');
    return res.data;
  },
};

export const orderApi = {
  create: async (data: {
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    note?: string;
    couponCode?: string;
    items: { productVariantId: string; quantity: number }[];
  }) => {
    const res = await apiClient.post<Order>('/api/v1/orders', data);
    return res.data;
  },
  getMyOrders: async () => {
    const res = await apiClient.get<Order[]>('/api/v1/orders/my-orders');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get<Order>(`/api/v1/orders/${id}`);
    return res.data;
  },
  cancel: async (id: string) => {
    const res = await apiClient.patch<Order>(`/api/v1/orders/${id}/cancel`);
    return res.data;
  },
  getAllOrders: async (status?: string) => {
    const res = await apiClient.get<Order[]>('/api/v1/orders', { params: { status } });
    return res.data;
  },
  updateStatus: async (id: string, data: { orderStatus?: string; paymentStatus?: string }) => {
    const res = await apiClient.patch<Order>(`/api/v1/orders/${id}/status`, data);
    return res.data;
  },
};

export const userApi = {
  getMe: async () => {
    const res = await apiClient.get<User>('/api/v1/users/me');
    return res.data;
  },
  updateProfile: async (data: { fullName: string; phone?: string }) => {
    const res = await apiClient.put<User>('/api/v1/users/me', data);
    return res.data;
  },
  getAll: async () => {
    const res = await apiClient.get<User[]>('/api/v1/users');
    return res.data;
  },
  updatePassword: async (userId: string, password: string) => {
    const res = await apiClient.patch<User>(`/api/v1/users/${userId}/password`, { password });
    return res.data;
  },
};

export const couponApi = {
  validate: async (code: string, amount?: number) => {
    const res = await apiClient.get<Coupon>('/api/v1/coupons/validate', {
      params: { code, amount },
    });
    return res.data;
  },
};

export const reviewApi = {
  getByProduct: async (productId: string) => {
    const res = await apiClient.get<Review[]>(`/api/v1/reviews/product/${productId}`);
    return res.data;
  },
};
