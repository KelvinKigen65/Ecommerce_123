/**
 * Order Success Page - Confirmation after successful order.
*/

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiCheckCircle, FiPackage } from 'react-icons/fi';
import axios from 'axios';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `http://localhost:8000/api/orders/${orderId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <p className="text-sm text-gray-500">
              Order ID: <span className="font-mono font-bold">#{order.id}</span>
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FiPackage className="mr-2" />
              Order Details
            </h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center border-b pb-4">
                  {item.product_image && (
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 ml-4">
                    <p className="font-semibold">{item.product_name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity} × ${item.price}
                    </p>
                  </div>
                  <p className="font-bold">${item.subtotal}</p>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${order.total_price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {order.shipping_cost === '0.00' ? 'FREE' : `$${order.shipping_cost}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">${order.tax_amount}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-xl">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary-600">
                  ${order.grand_total}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Name:</span> {order.first_name} {order.last_name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {order.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {order.phone}
              </p>
              <p>
                <span className="font-semibold">Address:</span> {order.address}
              </p>
              <p>
                <span className="font-semibold">City:</span> {order.city}, {order.postal_code}
              </p>
              <p>
                <span className="font-semibold">Country:</span> {order.country}
              </p>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Order Status</h2>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full font-semibold ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
              <div className={`px-4 py-2 rounded-full font-semibold ${
                order.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-primary-700 transition"
            >
              Continue Shopping
            </Link>
            <Link
              to="/profile"
              className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold text-center hover:border-primary-600 transition"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;