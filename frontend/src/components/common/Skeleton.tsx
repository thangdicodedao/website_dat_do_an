interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

// Layout wrapper với chiều cao cố định để tránh giật
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="aspect-4/3 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 animate-pulse rounded w-20" />
          <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton cho HomePage với layout đầy đủ
export function HomePageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="relative min-h-[400px] md:min-h-[600px] bg-gray-200 animate-pulse" />

      {/* Stats Skeleton */}
      <div className="bg-red-500 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-8 md:gap-16">
            <div className="h-8 w-24 bg-white/20 animate-pulse rounded" />
            <div className="h-8 w-24 bg-white/20 animate-pulse rounded" />
            <div className="h-8 w-24 bg-white/20 animate-pulse rounded" />
          </div>
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="h-7 w-32 bg-gray-200 animate-pulse rounded mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4">
              <div className="h-16 w-16 bg-gray-200 animate-pulse rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Products Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="h-7 w-32 bg-gray-200 animate-pulse rounded mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square md:aspect-4/3 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 w-20 bg-gray-200 animate-pulse rounded-xl flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4" />
          <div className="flex items-center gap-2">
            <div className="h-5 w-20 bg-gray-200 animate-pulse rounded" />
            <div className="h-5 w-24 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
          <div className="h-6 bg-gray-200 animate-pulse rounded w-full" />
          <div className="h-6 bg-gray-200 animate-pulse rounded w-2/3" />
          <div className="pt-4">
            <div className="h-12 bg-gray-200 animate-pulse rounded-xl w-full" />
          </div>
        </div>
      </div>

      {/* Reviews Skeleton */}
      <div className="mt-12 space-y-4">
        <div className="h-7 w-32 bg-gray-200 animate-pulse rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
                <div className="h-3 bg-gray-200 animate-pulse rounded w-16" />
              </div>
            </div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-4">
      <div className="h-16 w-16 bg-gray-200 animate-pulse rounded-xl" />
      <div className="h-5 bg-gray-200 animate-pulse rounded w-24" />
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 flex gap-4">
      <div className="h-20 w-20 bg-gray-200 animate-pulse rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4" />
      </div>
      <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-lg" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 bg-gray-200 animate-pulse rounded-full" />
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-32" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 animate-pulse rounded-xl w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 space-y-3">
      <div className="flex justify-between">
        <div className="h-5 bg-gray-200 animate-pulse rounded w-24" />
        <div className="h-5 bg-gray-200 animate-pulse rounded w-16" />
      </div>
      <div className="h-4 bg-gray-200 animate-pulse rounded w-32" />
      <div className="h-10 bg-gray-200 animate-pulse rounded-lg w-24" />
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 bg-gray-200 animate-pulse rounded w-48" />
          <div className="bg-white rounded-xl p-6 space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-xl w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 animate-pulse rounded w-32" />
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
            <div className="h-12 bg-gray-200 animate-pulse rounded-xl w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
