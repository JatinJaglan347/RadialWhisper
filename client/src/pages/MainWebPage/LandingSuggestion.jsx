import React, { useEffect, useState } from 'react';
import { Lightbulb, List } from 'lucide-react';
import LandingWriteSuggestion from '../../components/MainWebPage/LandingWriteSuggestion';
import LandingViewSuggestions from '../../components/MainWebPage/LandingViewSuggestions ';


const LandingSuggestion = () => {
  // Set default tab to 'view' so it loads the view suggestions first
  const [activeTab, setActiveTab] = useState('view');
  
  // Render content based on active tab
  
  const renderContent = () => {
    switch(activeTab) {
      case 'write':
        return <LandingWriteSuggestion key="write" />;
      case 'view':
      default:
        return <LandingViewSuggestions key="view" />;
    }
  };
  window.scrollTo(0, 0);
  
  return (
    <div className="min-h-screen bg-[#272829] text-[#FFF6E0]">
      
      {/* Animated floating orbs */}
      <div className="absolute top-40 right-40 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-30 animate-pulse" style={{animationDuration: '7s'}}></div>
      <div className="absolute bottom-60 left-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-20 animate-pulse" style={{animationDuration: '10s'}}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full mb-6">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium">Community Voice</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Your <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Suggestions</span>
          </h1>
          
          <p className="text-xl max-w-2xl mx-auto text-[#D8D9DA] leading-relaxed">
            Help shape the future of RadialWhisper by sharing your ideas and reviewing community suggestions.
          </p>
        </div>
        
        {/* Simplified Tab Navigation */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab('view')}
              className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === 'view' 
                  ? 'bg-[#FFF6E0] text-[#272829] font-medium' 
                  : 'bg-[#31333A] text-[#D8D9DA] hover:bg-[#3A3D42]'
              }`}
            >
              <List size={18} />
              <span>View Suggestions</span>
            </button>
            
            <button
              onClick={() => setActiveTab('write')}
              className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === 'write' 
                  ? 'bg-[#FFF6E0] text-[#272829] font-medium' 
                  : 'bg-[#31333A] text-[#D8D9DA] hover:bg-[#3A3D42]'
              }`}
            >
              <Lightbulb size={18} />
              <span>Write Suggestion</span>
            </button>
          </div>
        </div>
        
        {/* Content Area with clear visual indicator of active tab */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#31333A]/50 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-[#FFF6E0]/10">
            {/* Tab indicator */}
            <div className="mb-6 pb-4 border-b border-[#FFF6E0]/10">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                {activeTab === 'view' ? (
                  <>
                    <List size={20} />
                    Viewing Community Suggestions
                  </>
                ) : (
                  <>
                    <Lightbulb size={20} />
                    Write Your Suggestion
                  </>
                )}
              </h2>
            </div>
            
            {/* Content based on active tab */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingSuggestion;