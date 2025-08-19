import React from 'react';
import ReviewSystem from '../components/reviews/ReviewSystem';

const ReviewsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Customer Reviews
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            See what our customers are saying about our vehicle inspection services
          </p>
        </div>
        
        <ReviewSystem />
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to share your experience?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Your feedback helps us improve our services and assists other customers in making informed decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
