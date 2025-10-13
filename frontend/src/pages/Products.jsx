import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products/')
        setProducts(response.data.results || response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback mock data
        setProducts([
          {
            id: 1,
            name: "Wireless Headphones",
            price: "99.99",
            category: { name: "Electronics" },
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
          },
          {
            id: 2,
            name: "Smart Watch",
            price: "199.99",
            category: { name: "Electronics" },
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
          }
        ])
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="category" value="" 
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-700">All Categories</span>
                </label>
                {categories.map(category => (
                  <label key={category.id} className="flex items-center">
                    <input type="radio" name="category" value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={() => setSelectedCategory(category.id)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="card group hover:shadow-lg">
                <Link to={`/product/${product.id}`}>
                  <div className="overflow-hidden rounded-t-xl">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-6">
                  <span className="text-sm text-primary-600 font-medium">
                    {product.category?.name}
                  </span>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-xl font-semibold text-gray-900 mt-2 hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <button className="btn-primary">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products