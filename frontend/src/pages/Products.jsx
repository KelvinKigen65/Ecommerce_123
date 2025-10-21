/**
 * Products Page - Display all products with filtering and sorting.
 * Includes category filter and search functionality.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch categories once when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Fetch products whenever filters or search change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, searchParams]);

  // 🔹 Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      console.log('Categories fetched:', response.data);

      const categoryData = response.data.results || response.data;
      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // 🔹 Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const searchQuery = searchParams.get('q');
      let response;

      if (searchQuery) {
        console.log('Searching for:', searchQuery);
        response = await productsAPI.search(searchQuery);
      } else if (selectedCategory) {
        console.log('Filtering by category:', selectedCategory);
        response = await productsAPI.getByCategory(selectedCategory);
      } else {
        console.log('Fetching all products with sort:', sortBy);
        const params = {};
        if (sortBy) params.ordering = sortBy;
        response = await productsAPI.getAll(params);
      }

      console.log('API Response:', response.data);

      const productsData = response.data.results || response.data;
      console.log('Products data:', productsData);

      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 JSX Render
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-gray-600">
            Discover our amazing collection of products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedCategory === ''
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>

                  {Array.isArray(categories) &&
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition ${
                          selectedCategory === category.slug
                            ? 'bg-primary-600 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {category.name}
                        <span className="text-sm ml-2">
                          ({category.product_count})
                        </span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <h3 className="font-bold text-lg mb-4">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Default</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-created_at">Newest First</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p className="font-bold">Error loading products</p>
                <p>{error}</p>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {loading ? 'Loading...' : `${products.length} products found`}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-200 animate-pulse h-96 rounded-lg"
                  ></div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && !error && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 text-xl mb-4">No products found</p>
                <p className="text-gray-400 mb-8">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSortBy('');
                  }}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
