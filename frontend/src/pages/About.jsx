import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiAward,
  FiHeart,
  FiMapPin,
  FiPackage,
  FiShield,
  FiShoppingBag,
  FiTruck,
} from 'react-icons/fi';
import { categoriesAPI, productsAPI } from '../services/api';
import { FREE_SHIPPING_THRESHOLD, formatCurrency } from '../utils/currency';

const values = [
  {
    icon: FiShield,
    title: 'Trusted Quality',
    text: 'Every item is selected with durability, usefulness, and everyday value in mind.',
  },
  {
    icon: FiTruck,
    title: 'Fast Local Delivery',
    text: 'Orders are prepared quickly with clear delivery expectations for Kenyan shoppers.',
  },
  {
    icon: FiHeart,
    title: 'Customer First',
    text: 'We keep support simple, friendly, and focused on making every order feel easy.',
  },
];

const About = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categoryCount, setCategoryCount] = useState(0);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getFeatured(),
          categoriesAPI.getAll(),
        ]);

        const productData = productsRes.data.results || productsRes.data;
        const categoryData = categoriesRes.data.results || categoriesRes.data;

        setFeaturedProducts(Array.isArray(productData) ? productData.slice(0, 3) : []);
        setCategoryCount(Array.isArray(categoryData) ? categoryData.length : 0);
      } catch (error) {
        console.error('Error loading about page data:', error);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary-600 font-semibold uppercase tracking-wide mb-3">
                About HuslersShop
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                Everyday products, fair prices, and a smoother way to shop.
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                HuslersShop brings together practical electronics, fashion essentials,
                and lifestyle picks for customers who want value without the runaround.
                We focus on clear pricing in KSh, reliable stock, and products that fit
                real daily needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
                >
                  Shop Products
                  <FiArrowRight />
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-primary-600 hover:text-primary-600 transition text-center"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    className={`group bg-white rounded-lg shadow-md overflow-hidden ${
                      index === 0 ? 'col-span-2' : ''
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                        index === 0 ? 'h-64' : 'h-44'
                      }`}
                    />
                    <div className="p-4">
                      <p className="font-bold text-gray-900">{product.name}</p>
                      <p className="text-primary-600 font-semibold">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-2 bg-primary-50 rounded-lg p-10 text-center">
                  <FiShoppingBag size={64} className="mx-auto text-primary-600 mb-4" />
                  <p className="text-gray-700 font-semibold">Products loading from the catalog</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-extrabold">20+</div>
              <p className="text-primary-100">Products stocked</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold">{categoryCount || '2+'}</div>
              <p className="text-primary-100">Shopping categories</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold">{formatCurrency(FREE_SHIPPING_THRESHOLD)}</div>
              <p className="text-primary-100">Free shipping threshold</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold">+254</div>
              <p className="text-primary-100">Local support</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What We Stand For</h2>
            <p className="text-gray-600">
              A good online shop should be clear, quick, and dependable. These are
              the standards we use when improving the store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Serve You</h2>
              <p className="text-gray-600 leading-relaxed">
                From browsing to checkout, HuslersShop is built around simple steps
                and practical product information.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex gap-4 p-5 border rounded-lg">
                <FiPackage className="text-primary-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Real Catalog</h3>
                  <p className="text-gray-600 text-sm">Products are grouped by category with stock and sale prices visible.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 border rounded-lg">
                <FiAward className="text-primary-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Fair Deals</h3>
                  <p className="text-gray-600 text-sm">Compare prices and discounts are shown upfront in Kenyan shillings.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 border rounded-lg">
                <FiMapPin className="text-primary-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Local Focus</h3>
                  <p className="text-gray-600 text-sm">The shop is tuned for local pricing, support, and everyday delivery needs.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 border rounded-lg">
                <FiShoppingBag className="text-primary-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Easy Shopping</h3>
                  <p className="text-gray-600 text-sm">Browse, filter, add to cart, and check out without extra clutter.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
