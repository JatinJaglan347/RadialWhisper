import React from 'react';
import { MessageSquare, User, Clock, X, MessageCircle, Send, ArrowDown, Mail, Search, Filter, List, Users, ChevronRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with the correct backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500/api/v1',
  withCredentials: true
});

const OverlordMessage = ({ userId, isOpen, onClose }) => {
  const [loading, setLoading] = React.useState(false);
  const [userMessages, setUserMessages] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [selectedMessage, setSelectedMessage] = React.useState(null);
  const [selectedChatPartner, setSelectedChatPartner] = React.useState(null);
  const [chatView, setChatView] = React.useState(false);

  // Get user messages
  const getUserMessages = async () => {
    if (!userId) {
      toast.error('No user selected');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/v1/overlord/user-messages', {
        userId: userId
      });
      
      setUserMessages(response.data.data.messages);
      setSelectedChatPartner(null);
      setChatView(false);
      toast.success(`Retrieved ${response.data.data.count} messages`);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique chat partners from messages
  const chatPartners = React.useMemo(() => {
    if (!userMessages.length) return [];
    
    const partners = new Map();
    
    userMessages.forEach(message => {
      // Determine if the partner is the sender or recipient
      const partner = message.sender._id === userId ? message.recipient : message.sender;
      
      if (!partners.has(partner._id)) {
        partners.set(partner._id, {
          _id: partner._id,
          fullName: partner.fullName || 'Unknown User',
          uniqueTag: partner.uniqueTag,
          email: partner.email,
          lastMessage: message,
          messageCount: 1
        });
      } else {
        // Update existing partner data
        const existingPartner = partners.get(partner._id);
        existingPartner.messageCount += 1;
        
        // Update last message if this one is newer
        if (new Date(message.createdAt) > new Date(existingPartner.lastMessage.createdAt)) {
          existingPartner.lastMessage = message;
        }
      }
    });
    
    // Convert to array and sort by most recent message
    return Array.from(partners.values()).sort((a, b) => 
      new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );
  }, [userMessages, userId]);

  // Filter chat partners
  const filteredChatPartners = React.useMemo(() => {
    return chatPartners.filter(partner => 
      searchTerm === '' || 
      partner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.uniqueTag?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [chatPartners, searchTerm]);

  // Get conversation with selected partner
  const conversation = React.useMemo(() => {
    if (!selectedChatPartner) return [];
    
    return userMessages
      .filter(message => 
        (message.sender._id === userId && message.recipient._id === selectedChatPartner._id) ||
        (message.recipient._id === userId && message.sender._id === selectedChatPartner._id)
      )
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [userMessages, userId, selectedChatPartner]);

  // Filter conversation messages
  const filteredConversation = React.useMemo(() => {
    if (!conversation.length) return [];
    
    return conversation.filter(message => {
      const matchesSearch = searchTerm === '' || 
        message.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [conversation, searchTerm, filterStatus]);

  // Load messages when component mounts or becomes visible
  React.useEffect(() => {
    if (userId && isOpen) {
      getUserMessages();
    }
  }, [userId, isOpen]);

  // Go back to chat partners list
  const handleBackToList = () => {
    setSelectedChatPartner(null);
    setChatView(false);
    setSelectedMessage(null);
  };

  // Handle selecting a chat partner
  const handleSelectChatPartner = (partner) => {
    setSelectedChatPartner(partner);
    setChatView(true);
    setSelectedMessage(null);
  };

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
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-[#272829] to-[#31333A] rounded-2xl border border-red-900/20 shadow-2xl z-10 m-4">
        {/* Animated background effect */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
        </div>
        
        {/* Header */}
        <div className="relative flex justify-between items-center px-8 py-5 border-b border-red-900/20">
          <div className="flex items-center">
            {chatView && (
              <button 
                onClick={handleBackToList}
                className="mr-3 p-2 bg-[#1A1B1F]/80 hover:bg-[#1A1B1F] rounded-lg text-[#FFF6E0]/80 hover:text-[#FFF6E0] transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <h2 className="text-2xl font-bold flex items-center text-[#FFF6E0] bg-gradient-to-r from-[#FFF6E0] to-[#A3D8F4] bg-clip-text text-transparent">
              <MessageSquare className="mr-3 h-6 w-6 text-blue-400" />
              {chatView 
                ? `Chat with ${selectedChatPartner.fullName}`
                : "Message Connections"
              }
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#1A1B1F] rounded-full text-sm text-[#FFF6E0]/70">
              {chatView 
                ? `${conversation.length} messages` 
                : `${chatPartners.length} connections`
              }
            </span>
            <button 
              onClick={onClose}
              className="p-2 bg-[#1A1B1F] hover:bg-[#1A1B1F]/70 rounded-full transition-colors text-[#FFF6E0]/70 hover:text-[#FFF6E0]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Search and Filter */}
          <div className="mb-6 p-4 bg-[#1A1B1F]/60 rounded-xl border border-[#31333A]/70">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#FFF6E0]/50" />
                <input
                  type="text"
                  placeholder={chatView ? "Search messages..." : "Search connections..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#272829] border border-[#31333A] rounded-lg py-2 pl-10 pr-4 text-[#FFF6E0] placeholder-[#FFF6E0]/40 focus:outline-none focus:ring-1 focus:ring-blue-400/50 text-sm"
                />
              </div>
              
              <div className="flex gap-3">
                {chatView && (
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-[#FFF6E0]/50" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-[#272829] border border-[#31333A] rounded-lg py-2 px-3 text-[#FFF6E0] focus:outline-none focus:ring-1 focus:ring-blue-400/50 text-sm appearance-none cursor-pointer min-w-[120px]"
                    >
                      <option value="all">All Status</option>
                      <option value="read">Read</option>
                      <option value="unread">Unread</option>
                    </select>
                  </div>
                )}
                
                <button
                  onClick={getUserMessages}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2 text-sm"
                >
                  <div className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}>
                    {loading ? (
                      <svg className="animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </div>
                  <span>{loading ? "Loading..." : "Refresh"}</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center p-16">
              <div className="animate-spin mr-3 h-8 w-8 border-2 border-blue-400/70 border-t-transparent rounded-full"></div>
              <span className="text-[#FFF6E0]/70 text-lg">Loading messages...</span>
            </div>
          )}
          
          {/* Chat Partners List View */}
          {!loading && !chatView && (
            <>
              {filteredChatPartners.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredChatPartners.map((partner) => (
                    <div 
                      key={partner._id} 
                      className="bg-[#1A1B1F] rounded-xl border border-[#31333A] hover:border-[#31333A]/70 transition-all duration-200 overflow-hidden cursor-pointer"
                      onClick={() => handleSelectChatPartner(partner)}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-600/30 to-blue-800/30 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-[#FFF6E0]">{partner.fullName}</span>
                                <span className="text-xs text-[#FFF6E0]/60">#{partner.uniqueTag}</span>
                              </div>
                              <div className="text-xs text-[#FFF6E0]/60">
                                {partner.email}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                              {partner.messageCount} messages
                            </div>
                            <ChevronRight className="h-5 w-5 text-[#FFF6E0]/40" />
                          </div>
                        </div>
                        
                        <div className="p-3 bg-[#31333A]/30 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#FFF6E0]/70">
                                Last message:
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#31333A]/70 text-[#FFF6E0]/80">
                                {new Date(partner.lastMessage.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className={`px-2 py-0.5 rounded-full text-xs ${
                              partner.lastMessage.status === 'read' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {partner.lastMessage.status}
                            </div>
                          </div>
                          <p className="text-sm text-[#FFF6E0]/80 line-clamp-1">
                            {partner.lastMessage.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-[#FFF6E0]/70">
                  <div className="p-10 rounded-full bg-[#1A1B1F] mb-6">
                    <Users className="h-16 w-16 opacity-30" />
                  </div>
                  <p className="text-xl mb-2">No chat connections found</p>
                  <p className="text-sm text-center max-w-md">
                    {searchTerm
                      ? "No users match your search criteria." 
                      : "This user hasn't sent or received any messages yet."}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 px-4 py-2 bg-[#31333A] hover:bg-[#31333A]/70 rounded-lg text-sm transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </>
          )}
          
          {/* Chat Conversation View */}
          {!loading && chatView && (
            <>
              {filteredConversation.length > 0 ? (
                <div>
                  {/* Recipient Info Card */}
                  <div className="mb-6 bg-[#1A1B1F]/80 p-4 rounded-xl border border-[#31333A]/70">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-600/30 to-blue-800/30 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#FFF6E0]">{selectedChatPartner.fullName}</span>
                          <span className="text-xs text-[#FFF6E0]/60">#{selectedChatPartner.uniqueTag}</span>
                        </div>
                        <div className="text-xs text-[#FFF6E0]/60">
                          {selectedChatPartner.email}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                          {conversation.length} messages in conversation
                        </div>
                      </div>
                    </div>
                  </div>
                
                  {/* Message List */}
                  <div className="space-y-4 mb-6">
                    {filteredConversation.map((message) => {
                      const isFromSelectedUser = message.sender._id === userId;
                      return (
                        <div 
                          key={message._id} 
                          className={`flex ${isFromSelectedUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] ${
                              isFromSelectedUser 
                                ? 'bg-blue-600/20 border-blue-600/30' 
                                : 'bg-[#31333A]/80 border-[#31333A]'
                            } border rounded-lg overflow-hidden`}
                          >
                            <div className="p-3">
                              <div className="flex items-center gap-2 mb-1 text-xs text-[#FFF6E0]/60">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(message.createdAt).toLocaleString()}</span>
                                <div className={`ml-2 px-1.5 py-0.5 rounded-full ${
                                  message.status === 'read' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {message.status}
                                </div>
                              </div>
                              <p className="text-sm text-[#FFF6E0]/90 whitespace-pre-wrap">{message.message}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-[#FFF6E0]/70">
                  <div className="p-10 rounded-full bg-[#1A1B1F] mb-6">
                    <Mail className="h-16 w-16 opacity-30" />
                  </div>
                  <p className="text-xl mb-2">No messages found</p>
                  <p className="text-sm text-center max-w-md">
                    {searchTerm || filterStatus !== 'all' 
                      ? "Try adjusting your search filters to see more results." 
                      : "No messages in this conversation."}
                  </p>
                  {(searchTerm || filterStatus !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('all');
                      }}
                      className="mt-4 px-4 py-2 bg-[#31333A] hover:bg-[#31333A]/70 rounded-lg text-sm transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
          
          {/* No Messages State (Not loading and no messages at all) */}
          {!loading && userMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-[#FFF6E0]/70">
              <div className="p-10 rounded-full bg-[#1A1B1F] mb-6">
                <Mail className="h-16 w-16 opacity-30" />
              </div>
              <p className="text-xl mb-2">No messages found</p>
              <p className="text-sm text-center max-w-md">
                This user hasn't sent or received any messages yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverlordMessage; 