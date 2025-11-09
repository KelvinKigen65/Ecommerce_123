/**
 * Product Detail Page - Detailed view of a single product.
 
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiTruck, FiShield } from 'react-icons/fi';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getBySlug(slug);
      setProduct(response.data);
      setSelectedImage(response.data.image);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-700">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              {/* Main Image */}
              <div className="mb-4">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>

              {/* Image Gallery */}
              {product.images && product.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setSelectedImage(product.image)}
                    className="border-2 border-gray-300 rounded-lg overflow-hidden hover:border-primary-600 transition"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                  {product.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img.image)}
                      className="border-2 border-gray-300 rounded-lg overflow-hidden hover:border-primary-600 transition"
                    >
                      <img
                        src={img.image}
                        alt={img.alt_text || product.name}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Category */}
              <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>

              {/* Product Name */}
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-primary-600">
                  ${product.price}
                </span>
                {product.compare_price && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ${product.compare_price}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Save {product.discount_percentage}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.is_in_stock ? (
                  <p className="text-green-600 font-semibold">
                    In Stock ({product.stock} available)
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">Out of Stock</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity Selector */}
              {product.is_in_stock && (
                <div className="mb-6">
                  <label className="block font-semibold mb-2">Quantity</label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={decrementQuantity}
                      className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 font-bold"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.is_in_stock}
                  className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition ${
                    product.is_in_stock
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FiShoppingCart size={20} />
                  <span>Add to Cart</span>
                </button>
                <button className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-600 transition">
                  <FiHeart size={20} />
                </button>
              </div>

              {/* Features */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex items-center space-x-3 text-gray-700">
                  <FiTruck size={20} className="text-primary-600" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <FiShield size={20} className="text-primary-600" />
                  <span>1 year warranty included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;