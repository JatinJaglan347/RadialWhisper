import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router-dom";
import { BarChart, Loader, AreaChart, PieChart, TrendingUp, Activity, Share2 } from "lucide-react";

function WebsiteStatsPage() {
  const { authUser, isAdmin, isKing } = useAuthStore();
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  
  // Ensure only admins or kings can access this page
  if (!authUser) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin && !isKing) {
    return <Navigate to="/" />;
  }

  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#272829] to-[#31333A] text-[#FFF6E0]">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header section with animated gradient */}
          <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-[#61677A] to-[#4d525f] p-8">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FFF6E0]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#FFF6E0]/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center">
                  <BarChart className="mr-3 h-8 w-8" />
                  Website Analytics
                </h1>
                <p className="text-[#D8D9DA] max-w-2xl">
                  Comprehensive analytics dashboard showing visitor data, traffic sources, 
                  and user engagement metrics for RadialWhisper.
                </p>
              </div>
              
              <div className="mt-6 md:mt-0 flex space-x-4">
                <div className="flex items-center bg-[#272829]/50 px-4 py-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  <span>Live Data</span>
                </div>
                <div className="flex items-center bg-[#272829]/50 px-4 py-2 rounded-lg">
                  <Share2 className="h-5 w-5 mr-2" />
                  <span>Shared View</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-br from-[#31333A] to-[#272829] p-6 rounded-xl border border-[#61677A]/30 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Visitors</h3>
                <div className="p-2 bg-[#FFF6E0]/10 rounded-lg">
                  <AreaChart className="h-6 w-6 text-[#FFF6E0]" />
                </div>
              </div>
              <div className="text-3xl font-bold">Real-time</div>
              <div className="text-[#D8D9DA] mt-2 text-sm">Updated continuously</div>
            </div>
            
            <div className="bg-gradient-to-br from-[#31333A] to-[#272829] p-6 rounded-xl border border-[#61677A]/30 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Page Views</h3>
                <div className="p-2 bg-[#FFF6E0]/10 rounded-lg">
                  <Activity className="h-6 w-6 text-[#FFF6E0]" />
                </div>
              </div>
              <div className="text-3xl font-bold">Detailed</div>
              <div className="text-[#D8D9DA] mt-2 text-sm">Page-by-page breakdown</div>
            </div>
            
            <div className="bg-gradient-to-br from-[#31333A] to-[#272829] p-6 rounded-xl border border-[#61677A]/30 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Demographics</h3>
                <div className="p-2 bg-[#FFF6E0]/10 rounded-lg">
                  <PieChart className="h-6 w-6 text-[#FFF6E0]" />
                </div>
              </div>
              <div className="text-3xl font-bold">Global</div>
              <div className="text-[#D8D9DA] mt-2 text-sm">User location insights</div>
            </div>
          </div>
          
          {/* Main dashboard area */}
          <div className="bg-gradient-to-br from-[#31333A] to-[#272829] rounded-xl border border-[#61677A]/30 shadow-xl overflow-hidden relative">
            {!isIframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#31333A] to-[#272829] z-10">
                <Loader className="h-12 w-12 text-[#FFF6E0] animate-spin mb-4" />
                <p className="text-[#D8D9DA] text-lg">Loading analytics dashboard...</p>
              </div>
            )}
            
            <div className={`p-0 h-[800px] transition-opacity duration-500 ${isIframeLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <iframe
                src="https://cloud.umami.is/share/VvRmWf0JZu7Ujdyt/radial-whisper.vercel.app"
                className="w-full h-full border-0"
                title="Website Analytics"
                allow="fullscreen"
                onLoad={handleIframeLoad}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebsiteStatsPage;