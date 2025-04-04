import React from 'react';
import UserReviews from '../components/UserReviews';
import { useAuthStore } from '../store/useAuthStore';

const UserReviewsPage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="bg-white dark:bg-gray-800 p-6 rounded-t-lg shadow-sm border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Reviews</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and edit your reviews
            </p>
          </header>
          
          <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-sm">
            <UserReviews />
          </div>
          
          <div className="mt-6 flex justify-between">
            <a 
              href="/reviews" 
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Back to All Reviews
            </a>
            
            <a 
              href="/" 
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReviewsPage; 