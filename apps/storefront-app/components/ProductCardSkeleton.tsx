'use client';

interface ProductCardSkeletonProps {
  count?: number;
}

function SingleSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-56 bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-5">
        {/* Category badge */}
        <div className="h-5 w-20 bg-gray-200 rounded-full mb-3" />

        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-4 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>

        {/* Price */}
        <div className="h-7 w-24 bg-gray-200 rounded mb-4" />

        {/* Buttons */}
        <div className="flex gap-2">
          <div className="h-10 flex-1 bg-gray-200 rounded-lg" />
          <div className="h-10 w-10 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function ProductCardSkeleton({ count = 6 }: ProductCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
      {[...Array(count)].map((_, index) => (
        <SingleSkeleton key={index} />
      ))}
    </div>
  );
}
