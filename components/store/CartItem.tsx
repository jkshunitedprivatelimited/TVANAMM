'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: {
    sanityId: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    originalPrice: number;
    quantity: number;
    weight?: string;
    maxStock: number;
  };
}

export function CartItemRow({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-b-0">
      {/* Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
        {item.weight && (
          <p className="text-xs text-gray-400 mt-0.5">{item.weight}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          {/* Quantity controls */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg">
            <button
              onClick={() => updateQuantity(item.sanityId, item.quantity - 1)}
              className="p-1.5 text-gray-500 hover:text-[#006437] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.sanityId, item.quantity + 1)}
              disabled={item.quantity >= item.maxStock}
              className="p-1.5 text-gray-500 hover:text-[#006437] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-400">₹{item.price} each</p>
            )}
          </div>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.sanityId)}
        className="self-start p-1.5 text-gray-300 hover:text-red-500 transition-colors"
        aria-label={`Remove ${item.name} from cart`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
