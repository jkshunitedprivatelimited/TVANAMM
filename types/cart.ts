// ── Cart Types (Client-Side State) ──────────────────────────────

export interface CartItem {
  /** Sanity document _id */
  sanityId: string;
  name: string;
  slug: string;
  /** Sanity image URL (resolved) */
  image: string;
  /** Effective price (sale or regular) in ₹ */
  price: number;
  /** Original MRP in ₹ */
  originalPrice: number;
  quantity: number;
  weight?: string;
  sku: string;
  /** Max available stock */
  maxStock: number;
}

export interface CartState {
  items: CartItem[];
  /** Sum of all item prices × quantity */
  subtotal: number;
  /** Flat shipping fee — ₹250 */
  shippingFee: number;
  /** Total = subtotal + shippingFee */
  total: number;
  /** Total number of items in cart */
  itemCount: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { sanityId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { sanityId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE_CART'; payload: CartItem[] }
  | { type: 'UPDATE_SHIPPING_FEE' };

/** Default shipping fee in rupees (actual value fetched from store_settings) */
export const SHIPPING_FEE = 250;
