/**
 * Shopping Cart Page - View and manage cart items.
 * Includes quantity updates and checkout functionality.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  TAX_RATE,
  formatCurrency,
} from '../utils/currency';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const shippingCost = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const taxAmount = cartTotal * TAX_RATE;
  const grandTotal = cartTotal + shippingCost + taxAmount;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <FiShoppingBag size={80} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/products"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-block"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center border-b last:border-b-0 p-6"
                >
                  {/* Product Image */}
                  <Link to={`/product/${item.slug}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 ml-6">
                    <Link
                      to={`/product/${item.slug}`}
                      className="text-base font-semibold hover:text-primary-600 transition"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-500 text-sm mt-1">
                      {item.category_name}
                    </p>
                    <p className="text-primary-600 font-semibold text-base mt-2">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2 hover:bg-gray-100 transition"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="w-24 text-right">
                      <p className="font-semibold text-sm">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <div className="p-6 border-t">
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold">
                    {formatCurrency(taxAmount)}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl">
                  <span className="font-bold">Total</span>
                  <span className="font-semibold text-primary-600">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>

              {cartTotal < FREE_SHIPPING_THRESHOLD && (
                <p className="text-sm text-gray-600 mb-6 bg-yellow-50 p-3 rounded-lg">
                  Add {formatCurrency(FREE_SHIPPING_THRESHOLD - cartTotal)} more to get free shipping!
                </p>
              )}

              <Link
                to="/checkout"
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition block text-center"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="w-full mt-3 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:border-primary-600 transition block text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
