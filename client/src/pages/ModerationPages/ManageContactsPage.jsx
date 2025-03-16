import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, CheckCircle, XCircle, RefreshCw, Mail, AlertCircle, Calendar, User, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const ManageContactsPage = () => {
  const { 
    contacts, 
    fetchContacts, 
    updateContactStatus, 
    isLoading, 
    isUpdating,
    checkOpUser
  } = useAuthStore();

  const [searchEmail, setSearchEmail] = useState('');
  const [filterCompleted, setFilterCompleted] = useState('all'); // 'all', 'true', 'false'
  const [filterExistingUser, setFilterExistingUser] = useState('all'); // 'all', 'true', 'false'
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    // Check if user has admin privileges
    checkOpUser();
    
    // Initial fetch of contacts
    fetchContacts({});
  }, []);

  const handleSearch = () => {
    fetchContacts({ 
      email: searchEmail.trim() || undefined,
      contactCompleted: filterCompleted === 'all' ? undefined : filterCompleted === 'true'
      // Note: Backend would need to be updated to handle isExistingUser filter
    });

    // For client-side filtering of existing users when backend doesn't support it
    // This is just a fallback - ideally the backend should handle this filter
  };

  const handleRefresh = () => {
    setSearchEmail('');
    setFilterCompleted('all');
    setFilterExistingUser('all');
    fetchContacts({});
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateContactStatus(id, newStatus);
    if (selectedContact && selectedContact._id === id) {
      setSelectedContact(prev => ({...prev, contactCompleted: newStatus}));
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter contacts based on existingUser status if needed
  const filteredContacts = contacts && contacts.length > 0 ? 
    contacts.filter(contact => {
      if (filterExistingUser === 'all') return true;
      return filterExistingUser === 'true' ? contact.isExistingUser : !contact.isExistingUser;
    }) : [];

  const handleMailTo = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="min-h-screen bg-[#1E1F22] text-[#FFF6E0] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#1E1F22] opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#272829] via-[#31333A] to-[#1E1F22] opacity-70"></div>
      </div>
      
      {/* Animated floating orbs */}
      <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-20 animate-pulse" style={{animationDuration: '7s'}}></div>
      <div className="absolute bottom-60 left-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-10 animate-pulse" style={{animationDuration: '10s'}}></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 px-4 py-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => window.history.back()} className="p-2 rounded-full bg-[#31333A] hover:bg-[#61677A] transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
              Manage Contacts
            </h1>
          </div>
          <p className="text-[#D8D9DA] ml-11">Handle and respond to user contact requests</p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="p-6 rounded-xl bg-[#31333A]/50 border border-[#61677A]/30 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search by email..." 
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="w-full bg-[#272829] border border-[#61677A]/30 rounded-lg py-3 pl-4 pr-10 text-[#FFF6E0] placeholder-[#D8D9DA]/50 focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30"
                />
                <Search className="absolute right-3 top-3 h-5 w-5 text-[#D8D9DA]/50" />
              </div>
            </div>
            
            <div className="md:w-48">
              <select 
                value={filterCompleted}
                onChange={(e) => setFilterCompleted(e.target.value)}
                className="w-full bg-[#272829] border border-[#61677A]/30 rounded-lg px-4 py-3 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30 appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="false">Pending</option>
                <option value="true">Completed</option>
              </select>
            </div>

            <div className="md:w-48">
              <select 
                value={filterExistingUser}
                onChange={(e) => setFilterExistingUser(e.target.value)}
                className="w-full bg-[#272829] border border-[#61677A]/30 rounded-lg px-4 py-3 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30 appearance-none cursor-pointer"
              >
                <option value="all">All Users</option>
                <option value="true">Existing Users</option>
                <option value="false">Guest Users</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleSearch}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] rounded-lg font-medium hover:from-[#D8D9DA] hover:to-[#FFF6E0] transition-all duration-300 flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="animate-spin h-5 w-5 mr-2" /> : <Search className="h-5 w-5 mr-2" />}
                Search
              </button>
              
              <button 
                onClick={handleRefresh}
                className="p-3 bg-[#272829] border border-[#61677A]/30 rounded-lg hover:bg-[#31333A] transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content - Split View */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Contact List */}
          <div className="lg:w-2/5 h-[600px] overflow-y-auto rounded-xl bg-[#31333A]/50 border border-[#61677A]/30 p-4">
            <h2 className="text-xl font-semibold mb-4 px-2">Contact Requests</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin h-8 w-8 text-[#D8D9DA]" />
              </div>
            ) : filteredContacts && filteredContacts.length > 0 ? (
              <div className="space-y-2">
                {filteredContacts.map((contact) => (
                  <div 
                    key={contact._id} 
                    onClick={() => setSelectedContact(contact)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedContact && selectedContact._id === contact._id 
                        ? 'bg-[#FFF6E0]/20 border border-[#FFF6E0]/30' 
                        : 'bg-[#272829] border border-[#61677A]/30 hover:bg-[#272829]/80'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium truncate">{contact.name}</div>
                          {contact.isExistingUser && (
                            <span className="px-2 py-0.5 bg-[#FFF6E0]/20 text-[#FFF6E0] text-xs rounded-full">User</span>
                          )}
                        </div>
                        <div className="text-sm text-[#D8D9DA] truncate">{contact.email}</div>
                      </div>
                      <div className={`flex items-center ${contact.contactCompleted ? 'text-green-400' : 'text-amber-400'}`}>
                        {contact.contactCompleted ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-[#D8D9DA]/70 truncate">{contact.subject}</div>
                    <div className="mt-2 text-xs text-[#D8D9DA]/50">
                      {formatDate(contact.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-[#D8D9DA]">
                <Mail className="h-12 w-12 mb-4 opacity-40" />
                <p>No contact requests found</p>
              </div>
            )}
          </div>
          
          {/* Contact Details */}
          <div className="lg:w-3/5 h-[600px] rounded-xl bg-[#31333A]/50 border border-[#61677A]/30 p-0">
            {selectedContact ? (
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-[#61677A]/30 bg-[#272829]/50">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-medium">{selectedContact.subject}</h3>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleMailTo(selectedContact.email)}
                        className="px-4 py-2 rounded-lg text-sm font-medium flex items-center bg-[#61677A]/30 text-[#FFF6E0] hover:bg-[#61677A]/50 transition-colors"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Reply via Email
                      </button>
                      <button 
                        onClick={() => handleStatusChange(selectedContact._id, !selectedContact.contactCompleted)}
                        disabled={isUpdating}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                          selectedContact.contactCompleted 
                            ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' 
                            : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                        } transition-colors`}
                      >
                        {isUpdating ? (
                          <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                        ) : selectedContact.contactCompleted ? (
                          <XCircle className="h-4 w-4 mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        {selectedContact.contactCompleted ? "Mark as Pending" : "Mark as Completed"}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* User Info */}
                  <div className="p-4 rounded-lg bg-[#272829] border border-[#61677A]/30 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-[#FFF6E0]/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-[#FFF6E0]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">{selectedContact.name}</h4>
                            <button 
                            onClick={() => handleMailTo(selectedContact.email)}
                            className="px-2 py-1 text-xs flex items-center bg-[#61677A]/30 text-[#FFF6E0] hover:bg-[#61677A]/50 rounded-md transition-colors"
                            >
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                            </button>
                        </div>
                        <p className="text-sm text-[#D8D9DA]">{selectedContact.email}</p>
                    </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-[#D8D9DA]">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(selectedContact.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#D8D9DA]">
                        <User className="h-4 w-4" />
                        <span>{selectedContact.isExistingUser ? 'Registered User' : 'Guest User'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div>
                    <h4 className="text-lg font-medium mb-3">Message</h4>
                    <div className="p-4 rounded-lg bg-[#272829] border border-[#61677A]/30 whitespace-pre-wrap">
                      {selectedContact.message}
                    </div>
                  </div>
                  
                  {/* Status Info */}
                  <div className="mt-6 p-4 rounded-lg bg-[#272829]/50 border border-[#61677A]/30">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Status:</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        selectedContact.contactCompleted 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {selectedContact.contactCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#D8D9DA]">
                <Mail className="h-16 w-16 mb-4 opacity-30" />
                <p className="text-lg">Select a contact request to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageContactsPage;