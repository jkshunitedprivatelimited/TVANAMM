'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
  useRef,
  type ReactNode,
} from 'react';
import type { CartItem, CartState, CartAction } from '@/types/cart';
import { SHIPPING_FEE } from '@/types/cart';

const CART_STORAGE_KEY = 'tvanamm_cart';

// Shipping fee is mutable — starts with default, updated from API
let currentShippingFee = SHIPPING_FEE;

function calculateTotals(items: CartItem[]): Omit<CartState, 'items'> {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return {
    subtotal,
    shippingFee: items.length > 0 ? currentShippingFee : 0,
    total: items.length > 0 ? subtotal + currentShippingFee : 0,
    itemCount,
  };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  let newItems: CartItem[];

  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.sanityId === action.payload.sanityId);
      if (existing) {
        const newQty = Math.min(existing.quantity + action.payload.quantity, existing.maxStock);
        newItems = state.items.map((i) =>
          i.sanityId === action.payload.sanityId ? { ...i, quantity: newQty } : i
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      break;
    }
    case 'REMOVE_ITEM':
      newItems = state.items.filter((i) => i.sanityId !== action.payload.sanityId);
      break;
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        newItems = state.items.filter((i) => i.sanityId !== action.payload.sanityId);
      } else {
        newItems = state.items.map((i) =>
          i.sanityId === action.payload.sanityId
            ? { ...i, quantity: Math.min(action.payload.quantity, i.maxStock) }
            : i
        );
      }
      break;
    case 'CLEAR_CART':
      newItems = [];
      break;
    case 'HYDRATE_CART':
      newItems = action.payload;
      break;
    case 'UPDATE_SHIPPING_FEE':
      newItems = state.items; // Just trigger recalculation
      break;
    default:
      return state;
  }

  return { items: newItems, ...calculateTotals(newItems) };
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  shippingFee: 0,
  total: 0,
  itemCount: 0,
};

interface CartContextValue extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (sanityId: string) => void;
  updateQuantity: (sanityId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (sanityId: string) => boolean;
  getItemQuantity: (sanityId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isMounted, setIsMounted] = useState(false);
  const fetchedRef = useRef(false);

  // Fetch transport charge from API on mount
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetch('/api/store/settings', { cache: 'no-store' })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          const amount = data?.transport_charge?.amount;
          if (typeof amount === 'number' && amount >= 0) {
            currentShippingFee = amount;
            // Re-dispatch to recalculate totals with the fetched fee
            dispatch({ type: 'UPDATE_SHIPPING_FEE' });
          }
        }
      })
      .catch(() => {
        // Use default shipping fee if API fails
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hydrate from localStorage AFTER mount to avoid SSR hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const items: CartItem[] = JSON.parse(stored);
        dispatch({ type: 'HYDRATE_CART', payload: items });
      }
    } catch {
      // Corrupted data — start fresh
    }
  }, []);

  // Persist to localStorage on every change, but only after initial mount
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
      } catch {
        // Storage full or unavailable
      }
    }
  }, [state.items, isMounted]);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((sanityId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { sanityId } });
  }, []);

  const updateQuantity = useCallback((sanityId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { sanityId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const isInCart = useCallback(
    (sanityId: string) => state.items.some((i) => i.sanityId === sanityId),
    [state.items]
  );

  const getItemQuantity = useCallback(
    (sanityId: string) => state.items.find((i) => i.sanityId === sanityId)?.quantity ?? 0,
    [state.items]
  );

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
