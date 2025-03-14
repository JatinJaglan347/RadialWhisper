import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Radio, MapPin } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#272829] text-[#FFF6E0] relative overflow-hidden flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#272829] opacity-80"></div>
        <div className="absolute inset-0 bg-[url('/src/assets/images/city-background.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
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
      
      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full mb-6">
          <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium">404 Error</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Oops!</span>
        </h1>
        
        <h2 className="text-2xl md:text-4xl font-bold mb-8">
          It seems you've wandered <span className="text-[#D8D9DA]">outside the radius</span>
        </h2>
        
        <p className="text-xl mb-12 text-[#D8D9DA] max-w-lg mx-auto leading-relaxed">
          The page you're looking for is not in your connection range. Let's help you find your way back.
        </p>
        
        {/* 404 visual element */}
        <div className="relative mx-auto w-48 h-48 mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-[#61677A]/30 to-[#D8D9DA]/30 rounded-full opacity-60 blur-xl"></div>
          <div className="relative h-full flex items-center justify-center">
            <div className="absolute w-full h-full rounded-full border-4 border-[#61677A]/40 animate-ping" style={{animationDuration: '3s'}}></div>
            <div className="absolute w-3/4 h-3/4 rounded-full border-4 border-[#FFF6E0]/30"></div>
            <div className="absolute w-1/2 h-1/2 rounded-full border-4 border-[#FFF6E0]/20"></div>
            <Radio size={40} className="text-[#FFF6E0] animate-pulse" style={{animationDuration: '2s'}} />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="group relative overflow-hidden btn bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl">
            <Home className="mr-2 h-5 w-5" />
            <span className="relative z-10">Back to Home</span>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          </Link>
          
          <button onClick={() => window.history.back()} className="btn btn-outline text-[#FFF6E0] border-[#FFF6E0] hover:bg-[#FFF6E0] hover:text-[#272829] hover:border-[#FFF6E0] px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-md flex items-center justify-center">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </button>
        </div>
        
        {/* Suggestions */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold mb-6">Looking for these locations?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <Link to="/features" className="bg-[#31333A]/50 hover:bg-[#31333A] p-4 rounded-xl border border-[#61677A]/30 transition-all duration-300 flex items-center">
              <MapPin className="mr-3 h-5 w-5 text-[#FFF6E0]/70" />
              Features
            </Link>
            <Link to="/how-it-works" className="bg-[#31333A]/50 hover:bg-[#31333A] p-4 rounded-xl border border-[#61677A]/30 transition-all duration-300 flex items-center">
              <MapPin className="mr-3 h-5 w-5 text-[#FFF6E0]/70" />
              How It Works
            </Link>
            <Link to="/premium" className="bg-[#31333A]/50 hover:bg-[#31333A] p-4 rounded-xl border border-[#61677A]/30 transition-all duration-300 flex items-center">
              <MapPin className="mr-3 h-5 w-5 text-[#FFF6E0]/70" />
              Premium
            </Link>
            <Link to="/signup" className="bg-[#31333A]/50 hover:bg-[#31333A] p-4 rounded-xl border border-[#61677A]/30 transition-all duration-300 flex items-center">
              <MapPin className="mr-3 h-5 w-5 text-[#FFF6E0]/70" />
              Sign Up
            </Link> 
          </div>
        </div>
      </div>
      
      {/* Curved wave divider */}
      
    </div>
  );
};

export default NotFoundPage;