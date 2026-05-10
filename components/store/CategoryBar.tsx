'use client';

interface CategoryBarProps {
  categories: {
    _id: string;
    name: string;
    slug: { current: string };
  }[];
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryBar({ categories, activeSlug, onSelect }: CategoryBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide" role="tablist" aria-label="Product categories">
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
          activeSlug === null
            ? 'bg-[#006437] text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        role="tab"
        aria-selected={activeSlug === null}
      >
        All Products
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onSelect(cat.slug.current)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            activeSlug === cat.slug.current
              ? 'bg-[#006437] text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          role="tab"
          aria-selected={activeSlug === cat.slug.current}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
