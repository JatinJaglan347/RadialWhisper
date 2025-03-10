import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[#272829] text-[#FFF6E0] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">RadialWhisper</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Home</Link>
            <Link to="/about" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">About</Link>
            <Link to="/features" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Features</Link>
            <Link to="/contact" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Contact</Link>
            <Link to="/login" className="px-4 py-2 rounded-md bg-[#61677A] hover:bg-[#D8D9DA] hover:text-[#272829] font-medium transition duration-300">Login</Link>
            <Link to="/signup" className="px-4 py-2 rounded-md bg-[#FFF6E0] text-[#272829] hover:bg-[#D8D9DA] font-medium transition duration-300">Sign Up</Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#FFF6E0] hover:bg-[#61677A]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Home</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">About</Link>
            <Link to="/features" className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Features</Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Contact</Link>
            <Link to="/login" className="block px-3 py-2 rounded-md bg-[#61677A] text-center hover:bg-[#D8D9DA] hover:text-[#272829] font-medium">Login</Link>
            <Link to="/signup" className="block px-3 py-2 rounded-md bg-[#FFF6E0] text-center text-[#272829] hover:bg-[#D8D9DA] font-medium mt-2">Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;