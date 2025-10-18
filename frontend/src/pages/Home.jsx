/**
 * Home Page - Modern, attractive landing page with animations
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiCreditCard, FiRefreshCw, FiStar } from 'react-icons/fi';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [featuredRes, latestRes, categoriesRes] = await Promise.all([
        productsAPI.getFeatured(),
        productsAPI.getLatest(),
        categoriesAPI.getAll(),
      ]);
      setFeaturedProducts(featuredRes.data);
      setLatestProducts(latestRes.data);
      setCategories(categoriesRes.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-60 -left-20 w-60 h-60 bg-primary-300 rounded-full opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-primary-500 rounded-full opacity-15 animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in">
              <div className="inline-block">
                <span className="bg-primary-500 bg-opacity-50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                   New Arrivals Available
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                Discover Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-300">
                  Perfect Style
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-primary-100 leading-relaxed">
                Shop the latest trends with unbeatable prices. 
                Quality products delivered right to your door.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="group bg-white text-primary-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center"
                >
                  <span>Shop Now</span>
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/categories"
                  className="border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary-600 transition-all transform hover:scale-105 backdrop-blur-sm"
                >
                  Browse Categories
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-primary-200 text-sm">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-primary-200 text-sm">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">4.8★</div>
                  <div className="text-primary-200 text-sm">Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Decorative */}
            <div className="hidden lg:block relative">
              <div className="relative z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-pink-400 rounded-3xl transform rotate-6 opacity-20"></div>
                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🛍️</div>
                    <h3 className="text-2xl font-bold">Start Shopping Today!</h3>
                    <p className="text-primary-100">Exclusive deals waiting for you</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiTruck className="text-white" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-sm">On orders over $50</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiShield className="text-white" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">Secure Payment</h3>
              <p className="text-gray-600 text-sm">100% protected</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiRefreshCw className="text-white" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">30-day guarantee</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition group">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiCreditCard className="text-white" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">Best Prices</h3>
              <p className="text-gray-600 text-sm">Guaranteed quality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Shop By <span className="text-primary-600">Category</span>
            </h2>
            <p className="text-gray-600 text-lg">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-6xl">📦</div>
                  )}
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg group-hover:text-primary-600 transition">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">{category.product_count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">
                Featured <span className="text-primary-600">Products</span>
              </h2>
              <p className="text-gray-600 text-lg">Handpicked items just for you</p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center text-primary-600 hover:text-primary-700 font-bold text-lg group"
            >
              <span>View All</span>
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-96 rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-20 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Get 20% Off Your First Order!
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Sign up now and receive exclusive deals and offers
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-purple-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-2xl"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">
                New <span className="text-primary-600">Arrivals</span>
              </h2>
              <p className="text-gray-600 text-lg">Check out our latest products</p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center text-primary-600 hover:text-primary-700 font-bold text-lg group"
            >
              <span>View All</span>
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-96 rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Our <span className="text-primary-600">Customers Say</span>
            </h2>
            <p className="text-gray-600 text-lg">Don't just take our word for it</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Kelvin Kigen', review: 'Amazing quality and fast shipping! Will definitely order again.', rating: 5 },
              { name: 'Mercy Cheps', review: 'Great customer service and fantastic products. Highly recommended!', rating: 5 },
              { name: 'Daniel Njoroge', review: 'Best online shopping experience ever. Love the variety!', rating: 5 },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.review}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Shopping?</h2>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Join thousands of happy customers today
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-white text-primary-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-2xl"
          >
            <span>Browse Products</span>
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
             