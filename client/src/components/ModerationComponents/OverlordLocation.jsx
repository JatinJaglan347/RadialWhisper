import React, { useState, useEffect } from 'react';
import { MapPin, Clock, ExternalLink, X, Map, Navigation, History, Compass } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with the correct backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500/api/v1',
  withCredentials: true
});

const OverlordLocation = ({ userId, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [activeTab, setActiveTab] = useState('current');

  // Get user location history
  const getUserLocationHistory = async () => {
    if (!userId) {
      toast.error('No user selected');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/v1/overlord/user-location-history', {
        userId: userId
      });
      
      setLocationData(response.data.data);
      toast.success('Location history retrieved');
    } catch (error) {
      console.error('Error fetching location history:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch location history');
    } finally {
      setLoading(false);
    }
  };

  // Function to open location in Google Maps
  const openInGoogleMaps = (location) => {
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      toast.error('Invalid location data');
      return;
    }
    
    // Google Maps uses latitude,longitude format (reverse of our storage format)
    const [longitude, latitude] = location.coordinates;
    const url = `https://www.google.com/maps?q=${latitude},${longitude}&z=15`;
    window.open(url, '_blank');
  };

  // Load location data when component mounts or becomes visible
  useEffect(() => {
    if (userId && isOpen) {
      getUserLocationHistory();
    }
  }, [userId, isOpen]);

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-[#1A1B1F]/80 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-[#272829] to-[#31333A] rounded-2xl border border-red-900/20 shadow-2xl z-10 m-4">
        {/* Animated background effect */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
        </div>
        
        {/* Header */}
        <div className="relative flex justify-between items-center px-8 py-5 border-b border-red-900/20">
          <h2 className="text-2xl font-bold flex items-center text-[#FFF6E0] bg-gradient-to-r from-[#FFF6E0] to-[#FFB74D] bg-clip-text text-transparent">
            <MapPin className="mr-3 h-6 w-6 text-red-400" />
            User Location Tracker
          </h2>
          
          <button 
            onClick={onClose}
            className="p-2 bg-[#1A1B1F] hover:bg-[#1A1B1F]/70 rounded-full transition-colors text-[#FFF6E0]/70 hover:text-[#FFF6E0]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="relative p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Tabs */}
          <div className="flex border-b border-red-900/20 mb-6">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-5 py-3 flex items-center gap-2 transition-colors ${activeTab === 'current' ? 'border-b-2 border-red-400 text-[#FFF6E0]' : 'text-[#FFF6E0]/60 hover:text-[#FFF6E0]/80'}`}
            >
              <Navigation className="h-4 w-4" />
              <span>Current Location</span>
            </button>
            <button
              onClick={() => setActiveTab('previous')}
              className={`px-5 py-3 flex items-center gap-2 transition-colors ${activeTab === 'previous' ? 'border-b-2 border-red-400 text-[#FFF6E0]' : 'text-[#FFF6E0]/60 hover:text-[#FFF6E0]/80'}`}
            >
              <Compass className="h-4 w-4" />
              <span>Previous Location</span>
            </button>
            
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin mr-2 h-8 w-8 border-2 border-red-400/70 border-t-transparent rounded-full"></div>
              <span className="text-[#FFF6E0]/70 text-lg">Loading location data...</span>
            </div>
          ) : !locationData ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#FFF6E0]/70">
              <div className="p-10 rounded-full bg-[#1A1B1F] mb-6">
                <MapPin className="h-16 w-16 opacity-30" />
              </div>
              <p className="text-xl">No location data available</p>
              <p className="text-sm mt-2">This user hasn't shared their location yet.</p>
            </div>
          ) : (
            <>
              {/* Current Location Tab */}
              {activeTab === 'current' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-[#1A1B1F]/80 to-[#31333A]/80 rounded-xl border border-red-900/10 p-5 shadow-xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                      Current User Location
                    </h3>
                    
                    {locationData.currentLocation ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <div className="bg-[#1A1B1F] rounded-lg border border-[#31333A] p-4 mb-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-medium flex items-center">
                                <Navigation className="h-5 w-5 mr-2 text-red-400" />
                                Coordinates
                              </h4>
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">LIVE</span>
                            </div>
                            <div className="text-lg font-mono bg-[#31333A]/50 p-3 rounded-lg mb-3 text-center">
                              [{locationData.currentLocation.coordinates.join(', ')}]
                            </div>
                            <div className="text-sm text-[#FFF6E0]/60 flex items-center justify-end">
                              <Clock className="h-4 w-4 mr-1" />
                              Last updated: {new Date(locationData.locationUpdatedAt).toLocaleString()}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => openInGoogleMaps(locationData.currentLocation)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600/30 to-green-700/30 hover:from-green-600/40 hover:to-green-700/40 text-green-400 border border-green-600/30 rounded-lg transition-colors text-sm"
                          >
                            <Map className="h-5 w-5" />
                            <span>Open in Google Maps</span>
                          </button>
                        </div>
                        
                        <div className="bg-[#1A1B1F] rounded-lg border border-[#31333A] p-4 flex flex-col justify-center">
                          <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600/30 to-green-700/30 flex items-center justify-center mx-auto mb-3">
                              <MapPin className="h-8 w-8 text-green-400" />
                            </div>
                            <h4 className="font-medium text-lg">Current Position</h4>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-[#FFF6E0]/70">Latitude</span>
                              <span className="font-mono bg-[#31333A]/50 px-2 py-1 rounded">{locationData.currentLocation.coordinates[1]}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-[#FFF6E0]/70">Longitude</span>
                              <span className="font-mono bg-[#31333A]/50 px-2 py-1 rounded">{locationData.currentLocation.coordinates[0]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#1A1B1F] p-6 rounded-lg border border-[#31333A] text-center">
                        <p className="text-[#FFF6E0]/60 text-lg">No current location data available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Previous Location Tab */}
              {activeTab === 'previous' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-[#1A1B1F]/80 to-[#31333A]/80 rounded-xl border border-red-900/10 p-5 shadow-xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      Previous User Location
                    </h3>
                    
                    {locationData.previousLocation ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <div className="bg-[#1A1B1F] rounded-lg border border-[#31333A] p-4 mb-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-medium flex items-center">
                                <Compass className="h-5 w-5 mr-2 text-blue-400" />
                                Coordinates
                              </h4>
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">PREVIOUS</span>
                            </div>
                            <div className="text-lg font-mono bg-[#31333A]/50 p-3 rounded-lg mb-3 text-center">
                              [{locationData.previousLocation.coordinates.join(', ')}]
                            </div>
                          </div>
                          
                          <button
                            onClick={() => openInGoogleMaps(locationData.previousLocation)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600/30 to-blue-700/30 hover:from-blue-600/40 hover:to-blue-700/40 text-blue-400 border border-blue-600/30 rounded-lg transition-colors text-sm"
                          >
                            <Map className="h-5 w-5" />
                            <span>Open in Google Maps</span>
                          </button>
                        </div>
                        
                        <div className="bg-[#1A1B1F] rounded-lg border border-[#31333A] p-4 flex flex-col justify-center">
                          <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600/30 to-blue-700/30 flex items-center justify-center mx-auto mb-3">
                              <MapPin className="h-8 w-8 text-blue-400" />
                            </div>
                            <h4 className="font-medium text-lg">Previous Position</h4>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-[#FFF6E0]/70">Latitude</span>
                              <span className="font-mono bg-[#31333A]/50 px-2 py-1 rounded">{locationData.previousLocation.coordinates[1]}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-[#FFF6E0]/70">Longitude</span>
                              <span className="font-mono bg-[#31333A]/50 px-2 py-1 rounded">{locationData.previousLocation.coordinates[0]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#1A1B1F] p-6 rounded-lg border border-[#31333A] text-center">
                        <p className="text-[#FFF6E0]/60 text-lg">No previous location data available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
            
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverlordLocation; 