/**
 * Checkout Page - Order form and payment processing.
 * Integrates with M-Pesa STK Push for secure payments.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiSmartphone } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  TAX_RATE,
  formatCurrency,
} from '../utils/currency';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'Kenya',
  });
  const [loading, setLoading] = useState(false);

  const shippingCost = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const taxAmount = cartTotal * TAX_RATE;
  const grandTotal = cartTotal + shippingCost + taxAmount;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      const orderResponse = await ordersAPI.create(orderData);
      const mpesaResponse = await ordersAPI.initiateMpesaPayment(orderResponse.data.id, {
        phone: formData.phone,
      });

      toast.success(mpesaResponse.data.message || 'M-Pesa prompt sent to your phone');
      clearCart();
      navigate(`/order-success/${orderResponse.data.id}`);
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error.response?.data?.error || 'M-Pesa payment failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Postal Code</label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <FiSmartphone className="mr-2" />
                  M-Pesa Payment
                </h2>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="font-semibold text-green-800 mb-1">Pay with M-Pesa STK Push</p>
                  <p className="text-sm text-green-700">
                    We will send a payment prompt to the phone number above. Enter your M-Pesa PIN to complete the order.
                  </p>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <FiLock className="mr-2" />
                  <span>Your payment is processed securely through Safaricom M-Pesa</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending M-Pesa prompt...' : `Pay ${formatCurrency(grandTotal)} with M-Pesa`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-sm">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
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
                  <span className="font-semibold">{formatCurrency(taxAmount)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-xl">
                  <span className="font-bold">Total</span>
                  <span className="font-semibold text-primary-600">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  return <CheckoutForm />;
};

export default Checkout;
