import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const ProductDetail = () => {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)

  // Mock product data - replace with API call
  const product = {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 99.99,
    description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals alike.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600"
    ],
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Quick charge (15 min = 3 hours)",
      "Comfortable over-ear design",
      "Built-in microphone"
    ]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="card p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="flex gap-4 mt-4">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-primary-500"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <span className="text-primary-600 font-medium">{product.category}</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">{product.name}</h1>
          <p className="text-3xl font-bold text-gray-900 mt-4">${product.price}</p>
          
          <p className="text-gray-600 mt-6 leading-relaxed">{product.description}</p>

          {/* Features */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Add to Cart */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  -
                </button>
                <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="btn-primary flex-1 py-3 text-lg">
                Add to Cart
              </button>
              <button className="btn-secondary flex-1 py-3 text-lg">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail