import React, { useEffect, useState } from 'react';
import { Lightbulb, MessageCircle, ArrowRight, ChevronRight, Sparkles, Zap } from 'lucide-react';
import LandingWriteSuggestion from '../../components/MainWebPage/LandingWriteSuggestion';
import LandingViewSuggestions from '../../components/MainWebPage/LandingViewSuggestions ';

const LandingSuggestion = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [animating, setAnimating] = useState(false);
  
  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setAnimating(true);
      setTimeout(() => {
        setActiveTab(tab);
        setAnimating(false);
      }, 300);
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const renderContent = () => {
    switch(activeTab) {
      case 'write':
        return <LandingWriteSuggestion key="write" />;
      case 'view':
      default:
        return <LandingViewSuggestions key="view" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#272829] text-[#FFF6E0] overflow-hidden">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Radial gradients */}
        <div className="absolute top-0 right-0 w-[35vw] h-[35vw] rounded-full bg-[#61677A]/20 blur-[120px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full bg-[#61677A]/10 blur-[150px] opacity-30"></div>
        
        {/* Lines */}
        <div className="absolute top-1/4 left-10 w-[30vw] h-[1px] bg-gradient-to-r from-[#FFF6E0]/0 via-[#FFF6E0]/20 to-[#FFF6E0]/0"></div>
        <div className="absolute top-1/3 right-10 w-[20vw] h-[1px] bg-gradient-to-r from-[#FFF6E0]/0 via-[#FFF6E0]/10 to-[#FFF6E0]/0"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[1px] h-[20vh] bg-gradient-to-b from-[#FFF6E0]/0 via-[#FFF6E0]/10 to-[#FFF6E0]/0"></div>
        
        {/* Dots pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#FFF6E0_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>
      
      <div className="relative z-10 w-full">
        {/* Header section with 3D-inspired elements */}
        <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Badge */}
            <div className="inline-block relative z-10 mb-5">
              <div className="relative px-4 py-1.5 bg-[#31333A] rounded-full flex items-center space-x-2 border border-[#FFF6E0]/10">
                <Sparkles size={14} className="text-[#FFF6E0]" />
                <span className="text-sm font-medium">Community Voice</span>
              </div>
              <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-[#FFF6E0]/30 via-[#FFF6E0]/10 to-transparent blur-sm -z-10"></div>
            </div>
            
            {/* Main title with perspective effect */}
            <h1 className="text-6xl md:text-7xl font-bold mb-8 tracking-tight relative">
              <span className="inline-block transform -rotate-1 text-transparent bg-clip-text bg-gradient-to-br from-[#FFF6E0] to-[#D8D9DA]">
                Collective
              </span>
              <span className="inline-block ml-2 transform rotate-1 text-[#FFF6E0]">
                Vision
              </span>
              <span className="block mt-1 text-4xl md:text-5xl text-[#D8D9DA]/90 transform translate-x-4">
                Shape Our Future
              </span>
              
              {/* Decorative elements */}
              <div className="absolute top-1/2 -left-4 w-3 h-3 bg-[#FFF6E0]/30 rounded-full blur-sm"></div>
              <div className="absolute bottom-0 right-1/4 w-5 h-5 bg-[#FFF6E0]/20 rounded-full blur-sm"></div>
            </h1>
            
            {/* Description with asymmetric layout */}
            <div className="max-w-2xl mb-12 relative">
              <p className="text-xl text-[#D8D9DA] leading-relaxed ml-6 border-l-2 border-[#FFF6E0]/20 pl-6">
                Your ideas are the blueprint for our evolution. Share your vision, explore community suggestions, and help us build an experience that truly resonates.
              </p>
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-20 h-[1px] bg-gradient-to-r from-[#FFF6E0]/30 to-transparent"></div>
            </div>
          </div>
        </div>
        
        {/* Interactive navigation cards */}
        <div className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* View suggestions card */}
            <div 
              className={`group cursor-pointer relative rounded-2xl transition-all duration-500 overflow-hidden ${
                activeTab === 'view' 
                  ? 'bg-gradient-to-br from-[#FFF6E0]/10 to-[#31333A] border-[#FFF6E0]/20 border shadow-lg'
                  : 'bg-[#31333A]/40 hover:bg-[#31333A]/60 border-[#31333A]/60 border'
              }`}
              onClick={() => handleTabChange('view')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFF6E0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 p-6">
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    activeTab === 'view' 
                      ? 'bg-[#FFF6E0] text-[#272829]' 
                      : 'bg-[#31333A] text-[#FFF6E0] group-hover:scale-110'
                  }`}>
                    <MessageCircle size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      Explore Suggestions
                    </h3>
                    <p className="text-[#D8D9DA] text-sm mb-4">
                      Discover ideas from the community, like and bookmark your favorites, and see what others are suggesting.
                    </p>
                    
                    <div className={`flex items-center transition-all duration-300 ${
                      activeTab === 'view' ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                    }`}>
                      <span className="text-sm font-medium mr-2">
                        {activeTab === 'view' ? 'Currently viewing' : 'Browse suggestions'}
                      </span>
                      <ArrowRight size={16} className={`transition-transform duration-300 ${
                        activeTab === 'view' ? 'translate-x-1' : 'group-hover:translate-x-1'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Write suggestion card */}
            <div 
              className={`group cursor-pointer relative rounded-2xl transition-all duration-500 overflow-hidden ${
                activeTab === 'write' 
                  ? 'bg-gradient-to-br from-[#FFF6E0]/10 to-[#31333A] border-[#FFF6E0]/20 border shadow-lg'
                  : 'bg-[#31333A]/40 hover:bg-[#31333A]/60 border-[#31333A]/60 border'
              }`}
              onClick={() => handleTabChange('write')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFF6E0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 p-6">
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    activeTab === 'write' 
                      ? 'bg-[#FFF6E0] text-[#272829]' 
                      : 'bg-[#31333A] text-[#FFF6E0] group-hover:scale-110'
                  }`}>
                    <Lightbulb size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      Share Your Idea
                    </h3>
                    <p className="text-[#D8D9DA] text-sm mb-4">
                      Got a brilliant idea? Share your suggestion for new features, improvements, or anything that would enhance your experience.
                    </p>
                    
                    <div className={`flex items-center transition-all duration-300 ${
                      activeTab === 'write' ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                    }`}>
                      <span className="text-sm font-medium mr-2">
                        {activeTab === 'write' ? 'Currently writing' : 'Create suggestion'}
                      </span>
                      <ArrowRight size={16} className={`transition-transform duration-300 ${
                        activeTab === 'write' ? 'translate-x-1' : 'group-hover:translate-x-1'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content area with transition */}
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="max-w-4xl mx-auto">
            {/* Section header */}
            <div className="mb-8 flex items-center">
              <div className="w-10 h-10 rounded-lg bg-[#31333A] flex items-center justify-center mr-4">
                {activeTab === 'view' ? (
                  <MessageCircle size={20} className="text-[#FFF6E0]" />
                ) : (
                  <Lightbulb size={20} className="text-[#FFF6E0]" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-sm text-[#D8D9DA]">RadialWhisper</span>
                  <ChevronRight size={14} className="mx-2 text-[#D8D9DA]" />
                  <span className="text-sm font-medium">{activeTab === 'view' ? 'Explore Suggestions' : 'Create Suggestion'}</span>
                </div>
                <h2 className="text-2xl font-semibold">
                  {activeTab === 'view' ? 'Community Ideas' : 'Share Your Vision'}
                </h2>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                    activeTab === 'view' 
                      ? 'bg-[#FFF6E0]/10 text-[#FFF6E0] hover:bg-[#FFF6E0]/15' 
                      : 'bg-transparent text-[#D8D9DA] hover:text-[#FFF6E0]'
                  }`}
                  onClick={() => handleTabChange('view')}
                >
                  Explore
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                    activeTab === 'write' 
                      ? 'bg-[#FFF6E0]/10 text-[#FFF6E0] hover:bg-[#FFF6E0]/15' 
                      : 'bg-transparent text-[#D8D9DA] hover:text-[#FFF6E0]'
                  }`}
                  onClick={() => handleTabChange('write')}
                >
                  Create
                </button>
              </div>
            </div>
            
            {/* Content container with transition */}
            <div className={`transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingSuggestion;