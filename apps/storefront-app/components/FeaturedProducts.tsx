

export const FeaturedProducts: React.FC<{ products: any[] }> = ({ products }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {products.map((product) => (
      <div
        key={product._id.$oid}
        className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-24 h-24 object-cover mb-2 rounded"
        />
        <span className="font-semibold text-lg">{product.name}</span>
        <span className="text-primary-600 font-bold mt-1">${product.price}</span>
      </div>
    ))}
  </div>
);
