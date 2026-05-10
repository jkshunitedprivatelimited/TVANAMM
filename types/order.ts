// ── Order Types (Supabase DB) ───────────────────────────────────

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productSanityId: string;
  productName: string;
  productImage?: string;
  sku?: string;
  quantity: number;
  /** Unit price in paise */
  unitPrice: number;
  /** Total price in paise (unitPrice × quantity) */
  totalPrice: number;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  /** All monetary values in paise (1₹ = 100 paise) */
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: 'razorpay';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  /** Populated from join */
  items?: OrderItem[];
}

export interface Customer {
  id: string;
  authId: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  customerId: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
}

// ── Helper: convert rupees to paise ─────────────────────────────

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

// ── Order status display config ─────────────────────────────────

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  placed: { label: 'Order Placed', color: '#6366f1' },
  confirmed: { label: 'Confirmed', color: '#3b82f6' },
  processing: { label: 'Processing', color: '#f59e0b' },
  shipped: { label: 'Shipped', color: '#8b5cf6' },
  delivered: { label: 'Delivered', color: '#22c55e' },
  cancelled: { label: 'Cancelled', color: '#ef4444' },
  refunded: { label: 'Refunded', color: '#6b7280' },
};
