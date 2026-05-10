'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/types/cart';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: { current: string };
    shortDescription?: string;
    price: number;
    salePrice?: number;
    sku: string;
    weight?: string;
    inStock: boolean;
    stockQuantity: number;
    images: string[];
    category?: {
      name: string;
      slug: { current: string };
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isInCart, getItemQuantity } = useCart();

  const effectivePrice =
    product.salePrice && product.salePrice < product.price
      ? product.salePrice
      : product.price;



  const inCart = isInCart(product._id);
  const qtyInCart = getItemQuantity(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;

    const item: CartItem = {
      sanityId: product._id,
      name: product.name,
      slug: product.slug.current,
      image: product.images?.[0] || '',
      price: effectivePrice,
      originalPrice: product.price,
      quantity: 1,
      weight: product.weight,
      sku: product.sku,
      maxStock: product.stockQuantity,
    };
    addItem(item);
  };

  return (
    <Link
      href={`/store/${product.slug.current}`}
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ShoppingCart size={40} />
          </div>
        )}



        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-[#C8A96E] font-medium mb-1 uppercase tracking-wider">
            {product.category.name}
          </p>
        )}

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-[#006437] transition-colors">
          {product.name}
        </h3>

        {/* Weight */}
        {product.weight && (
          <p className="text-xs text-gray-400 mb-2">{product.weight}</p>
        )}



        {/* Price + Add to Cart */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ₹{effectivePrice}
            </span>
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-sm text-gray-400 line-through ml-2">
                ₹{product.price}
              </span>
            )}
          </div>

          {product.inStock && (
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                inCart
                  ? 'bg-[#006437] text-white'
                  : 'bg-[#006437]/10 text-[#006437] hover:bg-[#006437] hover:text-white'
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart size={14} />
              {inCart ? qtyInCart : 'Add'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
