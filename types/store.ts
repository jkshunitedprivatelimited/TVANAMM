// ── Product & Category Types (Sanity CMS) ───────────────────────

import { SanityImage } from './sanity';

export interface ProductCategory {
  _id: string;
  _type: 'productCategory';
  name: string;
  slug: { current: string };
  description?: string;
  image?: SanityImage;
  order: number;
  isActive: boolean;
}

export interface Product {
  _id: string;
  _type: 'product';
  _createdAt: string;
  name: string;
  slug: { current: string };
  shortDescription?: string;
  description?: Record<string, unknown>[]; // Portable Text blocks
  category: ProductCategory;
  weight?: string;
  tags?: string[];
  sku: string;
  price: number;
  salePrice?: number;
  inStock: boolean;
  stockQuantity: number;
  isFeatured: boolean;
  images: SanityImage[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface StoreBanner {
  _id: string;
  _type: 'storeBanner';
  title: string;
  subtitle?: string;
  image: SanityImage;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
}

// ── Computed / Display helpers ──────────────────────────────────

/** Returns salePrice if set, otherwise price */
export function getEffectivePrice(product: Product): number {
  return product.salePrice && product.salePrice < product.price
    ? product.salePrice
    : product.price;
}

/** Returns discount percentage if on sale */
export function getDiscountPercent(product: Product): number | null {
  if (!product.salePrice || product.salePrice >= product.price) return null;
  return Math.round(((product.price - product.salePrice) / product.price) * 100);
}
