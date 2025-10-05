import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Plus } from 'lucide-react';
import clsx from 'clsx';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  rating?: number;
  reviews?: number;
}

interface ModernProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
}

const ModernProductCard: React.FC<ModernProductCardProps> = ({ 
  product, 
  onAddToCart, 
  isLoading = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image || 'https://via.placeholder.com/400x400?text=Product'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Stock Badge */}
        {product.stock < 10 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            {product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
          </div>
        )}
        
        {/* Quick Add Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0 || isLoading}
          className={clsx(
            "absolute top-3 right-3 p-2 rounded-full transition-all duration-200",
            "bg-white/90 backdrop-blur-sm shadow-lg",
            "hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500",
            product.stock === 0 ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl"
          )}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="w-5 h-5 text-gray-700" />
          )}
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">
          {product.category}
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">
          {product.description}
        </p>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={clsx(
                    "w-4 h-4",
                    i < Math.floor(product.rating!) 
                      ? "text-yellow-400 fill-current" 
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviews || 0})
            </span>
          </div>
        )}
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0 || isLoading}
            className={clsx(
              "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
              product.stock === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernProductCard;