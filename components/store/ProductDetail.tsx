'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { ShoppingCart, Minus, Plus, ArrowLeft, Truck, Shield, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/types/cart';

interface ProductData {
  _id: string;
  _createdAt: string;
  name: string;
  slug: { current: string };
  shortDescription?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any[];
  price: number;
  salePrice?: number;
  sku: string;
  weight?: string;
  tags?: string[];
  inStock: boolean;
  stockQuantity: number;
  images: string[];
  category?: {
    _id: string;
    name: string;
    slug: { current: string };
  };
}

interface ProductDetailClientProps {
  product: ProductData;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem, isInCart, getItemQuantity, updateQuantity, removeItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const effectivePrice =
    product.salePrice && product.salePrice < product.price
      ? product.salePrice
      : product.price;



  const inCart = isInCart(product._id);
  const qtyInCart = getItemQuantity(product._id);

  const displayQuantity = inCart ? qtyInCart : quantity;

  const handleDecrease = () => {
    if (inCart) {
      if (qtyInCart === 1) {
        removeItem(product._id);
      } else {
        updateQuantity(product._id, qtyInCart - 1);
      }
    } else {
      setQuantity(Math.max(1, quantity - 1));
    }
  };

  const handleIncrease = () => {
    if (inCart) {
      updateQuantity(product._id, Math.min(product.stockQuantity, qtyInCart + 1));
    } else {
      setQuantity(Math.min(product.stockQuantity, quantity + 1));
    }
  };

  const handleAddToCart = () => {
    if (!product.inStock || inCart) return;

    const item: CartItem = {
      sanityId: product._id,
      name: product.name,
      slug: product.slug.current,
      image: product.images?.[0] || '',
      price: effectivePrice,
      originalPrice: product.price,
      quantity,
      weight: product.weight,
      sku: product.sku,
      maxStock: product.stockQuantity,
    };
    addItem(item);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/store" className="hover:text-[#006437] transition-colors flex items-center gap-1">
          <ArrowLeft size={14} />
          Store
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <span className="text-gray-500">{product.category.name}</span>
          </>
        )}
        <span>/</span>
        <span className="text-gray-700 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
          {/* Main image */}
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
            {product.images?.[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Package size={64} />
              </div>
            )}

          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? 'border-[#006437] ring-2 ring-[#006437]/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image src={img} alt={`${product.name} - Image ${i + 1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Category */}
          {product.category && (
            <p className="text-sm text-[#C8A96E] font-medium uppercase tracking-wider mb-2">
              {product.category.name}
            </p>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          {product.weight && (
            <p className="text-sm text-gray-500 mb-3">{product.weight}</p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">₹{effectivePrice}</span>
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-lg text-gray-400 line-through">₹{product.price}</span>
            )}
          </div>

          <p className="text-xs text-gray-400 mb-6">Inclusive of all taxes (GST)</p>

          {/* Quantity + Add to Cart */}
          {product.inStock ? (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex items-center border border-gray-200 rounded-xl">
                <button
                  onClick={handleDecrease}
                  className="p-3 text-gray-500 hover:text-[#006437] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-semibold">{displayQuantity}</span>
                <button
                  onClick={handleIncrease}
                  disabled={displayQuantity >= product.stockQuantity}
                  className="p-3 text-gray-500 hover:text-[#006437] transition-colors disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>

              {inCart ? (
                <Link
                  href="/cart"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors text-sm"
                >
                  <ShoppingCart size={18} />
                  Go to Cart
                </Link>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#006437] text-white rounded-xl font-semibold hover:bg-[#005530] transition-colors text-sm"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              )}
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-100 rounded-xl text-center">
              <p className="text-gray-600 font-medium">Currently Out of Stock</p>
              <p className="text-xs text-gray-400 mt-1">Check back soon for availability</p>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
              <Truck size={20} className="text-[#006437] mb-1.5" />
              <span className="text-xs font-medium text-gray-700">Fast Delivery</span>
              <span className="text-[10px] text-gray-400">Hyderabad & expanding</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
              <Shield size={20} className="text-[#006437] mb-1.5" />
              <span className="text-xs font-medium text-gray-700">Secure Payment</span>
              <span className="text-[10px] text-gray-400">Razorpay</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
              <Package size={20} className="text-[#006437] mb-1.5" />
              <span className="text-xs font-medium text-gray-700">Fresh Quality</span>
              <span className="text-[10px] text-gray-400">Guaranteed</span>
            </div>
          </div>

          {/* SKU */}
          <p className="text-xs text-gray-400">SKU: {product.sku}</p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
              <div className="prose prose-sm text-gray-600 max-w-none">
                <PortableText value={product.description} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
