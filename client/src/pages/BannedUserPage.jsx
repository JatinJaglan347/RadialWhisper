import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Send, 
  Shield, 
  ArrowLeft, 
  CheckCircle,
  Info
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import AOS from 'aos';
import 'aos/dist/aos.css';

const BannedUserPage = () => {
  const { authUser, submitContact } = useAuthStore();
  const navigate = useNavigate();
  
  const [showContactForm, setShowContactForm] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'Account Ban Appeal',
    message: '',
    isExistingUser: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Initialize AOS when component mounts
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: 'ease-out-cubic',
    });
    
    // Redirect if user is not banned
    if (authUser?.data?.user && !authUser.data.user.banned?.current?.status) {
      navigate('/');
    }
    
    window.scrollTo(0, 0);
  }, [authUser, navigate]);

  // Refresh AOS on route changes or when DOM changes
  useEffect(() => {
    AOS.refresh();
  }, [isSubmitted, showContactForm]);
  
  // Pre-fill form when user is logged in
  useEffect(() => {
    if (authUser?.data?.user) {
      const user = authUser.data.user;
      
      setFormState(prevState => ({
        ...prevState,
        name: user.fullName || '',
        email: user.email || '',
        isExistingUser: true
      }));
    }
  }, [authUser, setFormState]);
  
  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      await submitContact({
        name: formState.name,
        email: formState.email,
        subject: formState.subject,
        message: formState.message,
        isExistingUser: formState.isExistingUser
      });
  
      setIsSubmitted(true);
      setFormState(prevState => ({
        ...prevState,
        name: authUser?.data?.user?.fullName || '',
        email: authUser?.data?.user?.email || '',
        subject: 'Account Ban Appeal',
        message: '',
      }));
  
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setShowContactForm(false);
      }, 5000);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get user's ban data
  const getBanData = () => {
    if (!authUser?.data?.user) return null;
    
    const user = authUser.data.user;
    const currentBan = user.banned?.current;
    const banHistory = user.banned?.history || [];
    
    return {
      current: currentBan,
      history: banHistory
    };
  };
  
  const banData = getBanData();
  
  return (
    <div className="min-h-screen bg-[#272829] text-[#FFF6E0] relative">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#272829] opacity-80"></div>
        <div className="absolute inset-0 bg-[url('/src/assets/images/city-background.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#272829] via-[#31333A] to-transparent opacity-90"></div>
      </div>
      
      {/* Animated floating orbs */}
      <div className="absolute top-40 right-40 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-30 animate-pulse" style={{animationDuration: '7s'}}></div>
      <div className="absolute bottom-60 left-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-20 animate-pulse" style={{animationDuration: '10s'}}></div>
      <div className="absolute top-60 left-1/3 w-40 h-40 rounded-full bg-[#FFF6E0] blur-[80px] opacity-10 animate-pulse" style={{animationDuration: '8s'}}></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative z-10">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full mb-6">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium">Account Restricted</span>
          </div>
          
          <div className="flex justify-center items-center mb-6">
            <AlertTriangle size={50} className="text-red-500 mr-4" />
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Account <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Suspended</span>
            </h1>
          </div>
          
          <p className="text-xl max-w-2xl mx-auto text-[#D8D9DA] leading-relaxed">
            Your account has been temporarily suspended from RadialWhisper due to a violation of our community guidelines.
          </p>
        </div>
        
        {/* User Ban Information */}
        <div className="max-w-4xl mx-auto mb-16" data-aos="fade-up" data-aos-delay="100">
          <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-1 rounded-2xl shadow-xl">
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] rounded-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Card background effect */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-red-500/10 blur-[100px] opacity-30"></div>
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Shield className="mr-3 text-red-400" />
                  Account Status Information
                </h2>
                <div className="bg-[#31333A]/50 p-6 rounded-xl border border-[#61677A]/30">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <img 
                      src={authUser?.data?.user?.profileImageURL || "https://api.dicebear.com/9.x/fun-emoji/svg?seed=default"} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full border-2 border-red-400 p-1"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{authUser?.data?.user?.fullName || "User"}</h3>
                      <span className="text-[#D8D9DA] text-sm">#{authUser?.data?.user?.uniqueTag || "0000"}</span>
                    </div>
                    <div className="md:ml-auto">
                      <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                        Account Suspended
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm uppercase text-[#D8D9DA] mb-2 font-medium">Reason for Suspension</h4>
                      <p className="bg-[#272829] p-4 rounded-lg border border-[#61677A]/20 text-[#FFF6E0]">
                        {banData?.current?.reason || "Violation of community guidelines"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm uppercase text-[#D8D9DA] mb-2 font-medium">Date of Suspension</h4>
                      <p className="bg-[#272829] p-4 rounded-lg border border-[#61677A]/20 text-[#FFF6E0] flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-[#D8D9DA]" />
                        {banData?.current?.date ? formatDate(banData.current.date) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ban History Section */}
              {banData?.history && banData.history.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Clock className="mr-3 text-[#D8D9DA]" />
                    Account History
                  </h3>
                  <div className="bg-[#31333A]/50 p-6 rounded-xl border border-[#61677A]/30">
                    <div className="space-y-4">
                      {banData.history.map((entry, index) => (
                        <div key={index} className="border-l-2 border-[#61677A] pl-4 pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-3 h-3 rounded-full ${entry.status ? 'bg-red-400' : 'bg-green-400'}`}></div>
                            <span className="font-medium">{entry.status ? 'Account Suspended' : 'Suspension Lifted'}</span>
                            <span className="text-sm text-[#D8D9DA] ml-auto">
                              {formatDate(entry.date)}
                            </span>
                          </div>
                          <p className="text-[#D8D9DA] mb-1">
                            {entry.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Appeal Instructions */}
              <div className="bg-[#31333A]/50 p-6 rounded-xl border border-[#61677A]/30 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-[#FFF6E0]/10 p-3 rounded-full">
                    <Info className="text-[#FFF6E0]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">How to Appeal</h3>
                    <p className="text-[#D8D9DA] mb-4">
                      If you believe this suspension was made in error, you can submit an appeal. Our support team will review your case and respond within 24-48 hours.
                    </p>
                    <button 
                      onClick={() => setShowContactForm(prev => !prev)}
                      className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg flex items-center"
                    >
                      <MessageSquare className="mr-2 h-5 w-5" />
                      {showContactForm ? 'Hide Appeal Form' : 'Submit an Appeal'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Contact Form Section */}
              {showContactForm && (
                <div className="bg-[#31333A]/70 p-6 rounded-xl border border-[#61677A]/30 mb-4" data-aos="fade-up">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <MessageSquare className="mr-3 text-[#FFF6E0]" />
                    Appeal Form
                  </h3>
                  
                  {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <CheckCircle size={64} className="text-green-400 mb-6" />
                      <h3 className="text-2xl font-bold mb-2">Appeal Submitted!</h3>
                      <p className="text-[#D8D9DA] text-center mb-6">
                        Thank you for reaching out. Our moderation team will review your appeal and respond within 24-48 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            required
                            disabled={formState.isExistingUser}
                            className={`w-full bg-[#272829] border border-[#61677A] rounded-lg px-4 py-3 text-[#FFF6E0] placeholder-[#61677A] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/50 transition-all ${
                              formState.isExistingUser ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            placeholder="Your Name"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">Your Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formState.email}
                            onChange={handleChange}
                            required
                            disabled={formState.isExistingUser}
                            className={`w-full bg-[#272829] border border-[#61677A] rounded-lg px-4 py-3 text-[#FFF6E0] placeholder-[#61677A] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/50 transition-all ${
                              formState.isExistingUser ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#272829] border border-[#61677A] rounded-lg px-4 py-3 text-[#FFF6E0] placeholder-[#61677A] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/50 transition-all"
                          placeholder="Account Appeal"
                        />
                      </div>
                      
                      <div className="mb-8">
                        <label htmlFor="message" className="block text-sm font-medium mb-2">Your Appeal</label>
                        <textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          required
                          rows="5"
                          className="w-full bg-[#272829] border border-[#61677A] rounded-lg px-4 py-3 text-[#FFF6E0] placeholder-[#61677A] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/50 transition-all resize-none"
                          placeholder="Please explain why you believe this suspension should be reconsidered..."
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="group relative overflow-hidden bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                        >
                          <span className="relative z-10 flex items-center">
                            {isSubmitting ? 'Submitting...' : 'Submit Appeal'}
                            <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
              
              {/* Return to Home Link */}
              <div className="flex justify-center mt-8">
                <Link 
                  to="/" 
                  className="flex items-center text-[#D8D9DA] hover:text-[#FFF6E0] transition-colors"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannedUserPage;