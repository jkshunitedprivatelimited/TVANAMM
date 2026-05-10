'use client';

import { useState, useMemo } from 'react';
import { ShoppingBag } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { SearchBar } from './SearchBar';
import { CategoryBar } from './CategoryBar';
import { SortDropdown, type SortOption } from './SortDropdown';

interface StoreProduct {
  _id: string;
  _createdAt: string;
  name: string;
  slug: { current: string };
  shortDescription?: string;
  price: number;
  salePrice?: number;
  sku: string;
  weight?: string;
  tags?: string[];
  inStock: boolean;
  stockQuantity: number;
  isFeatured?: boolean;
  images: string[];
  category?: {
    _id: string;
    name: string;
    slug: { current: string };
  };
}

interface StoreCategory {
  _id: string;
  name: string;
  slug: { current: string };
}

interface ProductGridProps {
  products: StoreProduct[];
  categories: StoreCategory[];
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const filtered = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory) {
      result = result.filter(
        (p) => p.category?.slug?.current === activeCategory
      );
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        result.sort(
          (a, b) =>
            new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
        );
        break;
    }

    return result;
  }, [products, searchQuery, activeCategory, sortBy]);

  return (
    <div>
      {/* Controls bar */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <SearchBar onSearch={setSearchQuery} />
          <div className="flex items-center gap-3 sm:ml-auto">
            <SortDropdown value={sortBy} onChange={setSortBy} />
            <span className="text-sm text-gray-400 whitespace-nowrap">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Categories */}
        <CategoryBar
          categories={categories}
          activeSlug={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag size={28} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search term.`
              : 'No products available in this category right now.'}
          </p>
          {(searchQuery || activeCategory) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory(null);
              }}
              className="mt-4 px-4 py-2 bg-[#006437] text-white rounded-xl text-sm font-semibold hover:bg-[#005530] transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
