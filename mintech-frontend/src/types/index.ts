export type UUID = string;

export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: UUID;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Address {
  id: UUID;
  recipientName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  isDefault: boolean;
}

export interface Category {
  id: UUID;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  status?: string;
  parentId?: UUID;
}

export interface Brand {
  id: UUID;
  name: string;
  slug: string;
  logoUrl?: string;
  status?: string;
}

export interface ProductVariant {
  id: UUID;
  sku: string;
  color: string;
  price: number;
  originalPrice: number;
  stockQuantity: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ProductImage {
  id: UUID;
  imageUrl: string;
  sortDisplay: number;
}

export interface ProductSpecification {
  id: UUID;
  specName: string;
  specValue: string;
}

export interface Product {
  id: UUID;
  name: string;
  slug: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  thumbnailUrl: string;
  categoryId?: UUID;
  categoryName?: string;
  brandId?: UUID;
  brandName?: string;
  createdAt?: string;
  updatedAt?: string;
  variants: ProductVariant[];
  images?: ProductImage[];
  specifications?: ProductSpecification[];
}

export interface CartItem {
  cartItemId: UUID;
  productVariantId: UUID;
  productName: string;
  color: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
  thumbnailUrl?: string;
}

export interface Cart {
  id?: UUID;
  items: CartItem[];
  totalPrice: number;
  updatedAt?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: UUID;
  productVariantId: UUID;
  productName: string;
  color?: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: UUID;
  orderCode: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  note?: string;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
}

export interface Coupon {
  id: UUID;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount?: number;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
}

export interface Review {
  id: UUID;
  productId: UUID;
  productName?: string;
  userId?: UUID;
  userName?: string;
  rating: number;
  comment: string;
  status: 'VISIBLE' | 'HIDDEN';
  createdAt: string;
}

export interface Shipment {
  id: UUID;
  orderId: UUID;
  orderCode?: string;
  recipientName?: string;
  shippingAddress?: string;
  carrier: string;
  trackingNumber: string;
  status: 'PREPARING' | 'PICKED_UP' | 'SHIPPING' | 'DELIVERED' | 'RETURNED';
  shippedAt?: string;
  deliveryDate?: string;
}

