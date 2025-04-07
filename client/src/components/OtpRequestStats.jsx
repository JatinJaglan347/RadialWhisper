import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const OtpRequestStats = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { getOtpRequestStats, otpRequestCount } = useAuthStore();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      await getOtpRequestStats();
    } catch (error) {
      toast.error('Failed to fetch OTP statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const resetCounter = async () => {
    setIsResetting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/otp/reset-counter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('OTP counter reset successfully');
        fetchStats();
      } else {
        toast.error(data.message || 'Failed to reset counter');
      }
    } catch (error) {
      toast.error('Failed to reset OTP counter');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">OTP Request Statistics</h2>
        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-600 text-sm">Total OTP Requests:</span>
            <div className="text-3xl font-bold text-blue-600">{otpRequestCount}</div>
          </div>
          
          <div className="bg-blue-100 p-3 rounded-full">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <button
          onClick={resetCounter}
          disabled={isResetting}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition flex items-center justify-center"
        >
          {isResetting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Resetting...
            </>
          ) : (
            'Reset Counter'
          )}
        </button>
        
        <div className="text-xs text-gray-500 mt-2 flex items-start">
          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
          <span>
            Resetting the counter will set the OTP request count back to zero. This action cannot be undone.
          </span>
        </div>
      </div>
    </div>
  );
};

export default OtpRequestStats; 