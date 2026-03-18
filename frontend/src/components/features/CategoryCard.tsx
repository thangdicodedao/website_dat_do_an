import { Link } from 'react-router-dom';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-gray-300 text-sm mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}
