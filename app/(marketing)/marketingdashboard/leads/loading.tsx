// No imports needed

export default function LeadsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 w-64 bg-gray-200 rounded-lg mb-2" />
          <div className="h-4 w-96 bg-gray-100 rounded-lg" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-1 w-full sm:w-auto">
            <div className="h-10 w-full max-w-md bg-gray-200 rounded-lg" />
            <div className="h-10 w-24 bg-gray-100 rounded-lg" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop Table Skeleton */}
          <div className="hidden md:block">
            <div className="bg-gray-50 h-14 w-full border-b border-gray-100" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex px-5 py-4 border-b border-gray-50">
                <div className="flex-1 h-4 bg-gray-100 rounded mr-4" />
                <div className="flex-1 h-4 bg-gray-50 rounded mr-4" />
                <div className="flex-1 h-4 bg-gray-100 rounded mr-4" />
                <div className="flex-1 h-4 bg-gray-50 rounded" />
              </div>
            ))}
          </div>

          {/* Mobile Card Skeleton */}
          <div className="md:hidden divide-y divide-gray-100">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
                <div className="h-10 w-full bg-gray-50 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
