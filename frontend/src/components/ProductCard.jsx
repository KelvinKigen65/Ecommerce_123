/**
 * Product Card component - Modern, attractive design
 * Beautiful card design with smooth animations and hover effects
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount_percentage > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              -{product.discount_percentage}% OFF
            </span>
          )}
          {product.featured && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {!product.is_in_stock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-lg shadow-xl">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Actions - Hover */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              // Add to wishlist functionality
            }}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 transition mb-2"
          >
            <FiHeart size={20} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-2">
          {product.category_name}
        </p>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">
              ${product.price}
            </span>
            {product.compare_price && (
              <span className="text-sm text-gray-400 line-through">
                ${product.compare_price}
              </span>
            )}
          </div>
          
          {/* Stock Badge */}
          {product.is_in_stock && product.stock < 10 && (
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-semibold">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.is_in_stock}
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
            product.is_in_stock
              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <FiShoppingCart size={18} />
          <span>{product.is_in_stock ? 'Add to Cart' : 'Unavailable'}</span>
        </button>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-300 transition-colors duration-300 pointer-events-none"></div>
    </Link>
  );
};

export default ProductCard;