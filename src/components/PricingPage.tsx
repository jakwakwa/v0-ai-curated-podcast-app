import React from 'react';
import { PADDLE_PRODUCTS, openCheckout } from '../lib/paddle';

const PricingPage: React.FC = () => {
  const handleSubscribe = async (priceId: string) => {
    try {
      await openCheckout(priceId);
    } catch (error) {
      console.error('Failed to open checkout:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:flex sm:flex-col sm:align-center">
        <h1 className="text-5xl font-extrabold text-gray-900 sm:text-center">
          Choose Your Plan
        </h1>
        <p className="mt-5 text-xl text-gray-500 sm:text-center">
          Start with a 14-day free trial. No credit card required.
        </p>
      </div>

      <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
        {/* Casual Listener Plan */}
        <div className="border rounded-lg shadow-sm divide-y divide-gray-200">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900">Casual Listener</h2>
            <p className="mt-4 text-gray-500">Perfect for podcast enthusiasts who want a curated experience.</p>
            <p className="mt-8">
              <span className="text-4xl font-extrabold text-gray-900">$6.95</span>
              <span className="text-base font-medium text-gray-500">/month</span>
            </p>
            <button
              onClick={() => handleSubscribe(PADDLE_PRODUCTS.CASUAL_LISTENER)}
              className="mt-8 block w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700"
            >
              Start Free Trial
            </button>
          </div>
        </div>

        {/* Curate & Control Plan */}
        <div className="border rounded-lg shadow-sm divide-y divide-gray-200">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900">Curate & Control</h2>
            <p className="mt-4 text-gray-500">For power users who want full control over their podcast experience.</p>
            <p className="mt-8">
              <span className="text-4xl font-extrabold text-gray-900">$10.00</span>
              <span className="text-base font-medium text-gray-500">/month</span>
            </p>
            <button
              onClick={() => handleSubscribe(PADDLE_PRODUCTS.CURATE_CONTROL)}
              className="mt-8 block w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
