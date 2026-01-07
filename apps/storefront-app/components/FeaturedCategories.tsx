

const categories = [
  { name: 'Electronics', image: '/images/electronics.jpg' },
  { name: 'Fitness', image: '/images/fitness.jpg' },
  { name: 'Home', image: '/images/home.jpg' },
  { name: 'Accessories', image: '/images/accessories.jpg' },
];

export const FeaturedCategories: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {categories.map((cat) => (
      <div key={cat.name} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <img src={cat.image} alt={cat.name} className="w-20 h-20 object-cover mb-2 rounded-full" />
        <span className="font-semibold text-lg">{cat.name}</span>
      </div>
    ))}
  </div>
);
