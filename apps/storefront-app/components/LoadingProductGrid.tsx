

interface ProductSkeletonGridProps {
  count?: number;
  variant?: 'default' | 'compact';
}

export const ProductSkeletonGrid: React.FC<ProductSkeletonGridProps> = ({
  count = 8,
  variant = 'default',
}) => {
  const gridClasses = variant === 'compact' 
    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';

  const heightClasses = variant === 'compact' ? 'h-32' : 'h-48';

  return (
    <div className={`grid ${gridClasses}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-lg overflow-hidden bg-white shadow-md">
          <div
            className={`${heightClasses} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse`}
          ></div>

          <div className="p-4 space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>

            <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 animate-pulse"></div>

            {variant === 'default' && (
              <>
                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-24 animate-pulse mt-2"></div>

                <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse mt-3"></div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export const LoadingProductGrid = ProductSkeletonGrid;
