import React from 'react';
import { Radio } from 'lucide-react';

const Loader = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading..."
      className="flex flex-col items-center justify-center min-h-screen bg-[#272829] relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#272829] opacity-80"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#272829] via-[#31333A] to-transparent opacity-90"></div>
      </div>
      
      {/* Animated floating orbs */}
      <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-30 animate-pulse" style={{animationDuration: '7s'}}></div>
      <div className="absolute bottom-60 left-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-20 animate-pulse" style={{animationDuration: '10s'}}></div>
      <div className="absolute top-20 left-1/4 w-40 h-40 rounded-full bg-[#FFF6E0] blur-[80px] opacity-10 animate-pulse" style={{animationDuration: '8s'}}></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Main loader content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated radio icon */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-[#61677A]/30 to-[#D8D9DA]/30 rounded-full opacity-60 blur-xl"></div>
          <div className="relative h-full flex items-center justify-center">
            <div className="absolute w-full h-full rounded-full border-4 border-[#61677A]/40 animate-spin"></div>
            <div className="absolute w-3/4 h-3/4 rounded-full border-4 border-[#FFF6E0]/30"></div>
            <Radio size={30} className="text-[#FFF6E0] animate-pulse" />
          </div>
        </div>

        {/* Animated title */}
        <div className="relative">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#FFF6E0] via-[#D8D9DA] to-[#61677A] animate-gradient">
            Radial Whisper
          </h1>
          <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#FFF6E0] via-[#D8D9DA] to-[#61677A] animate-shimmer"></div>
        </div>

        {/* Loading text */}
        <p className="mt-4 text-[#D8D9DA] text-lg animate-pulse">
          Loading your experience...
        </p>
      </div>

      {/* Add the style tag for animations */}
      <style jsx="true">{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
