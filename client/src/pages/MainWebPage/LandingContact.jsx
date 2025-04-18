import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, MessageSquare, MapPin, Phone, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js'; // Import the auth store
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS CSS


const LandingContact = () => {
  const { authUser , submitContact } = useAuthStore(); // Get the authenticated user from store

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    isExistingUser: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize AOS when component mounts
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false, // whether animation should happen only once - while scrolling down
      mirror: true, // whether elements should animate out while scrolling past them
      easing: 'ease-out-cubic',
    });
  }, []);
  window.scrollTo(0, 0);
  // Refresh AOS on route changes or when DOM changes
  useEffect(() => {
    AOS.refresh();
  }, [isSubmitted]); // Refresh when content changes (like form submission)
  
  // Use effect to pre-fill form when use`r is logged in
  useEffect(() => {
    console.log("authUser updated:", authUser);
    if (authUser?.data?.user) {
      const user = authUser.data.user;
      console.log("Updating form state with:", user.fullName, user.email);
  
      setFormState(prevState => ({
        ...prevState,
        name: user.fullName || '',
        email: user.email || '',
        isExistingUser: true // Set to true if user is logged in
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
        subject: '',
        message: '',
      }))
  
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  
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
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium">Get In Touch</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Let's <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Connect</span>
          </h1>
          
          <p className="text-xl max-w-2xl mx-auto text-[#D8D9DA] leading-relaxed">
            Have questions about RadialWhisper? Want to partner with us? 
            We'd love to hear from you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {/* Contact Card - Location */}
          <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-10px] group" data-aos="fade-up" data-aos-delay="100">
            <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <div className="bg-gradient-to-r from-[#FFF6E0]/20 to-[#D8D9DA]/20 p-4 rounded-full">
                <MapPin size={32} className="text-[#FFF6E0]" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4 text-center">Visit Us</h3>
            <p className="text-center text-[#D8D9DA] leading-relaxed">
              123 Innovation Drive<br />
              San Francisco, CA 94103<br />
              United States
            </p>
          </div>
          
          {/* Contact Card - Phone */}
          <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-10px] group" data-aos="fade-up" data-aos-delay="200">
            <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <div className="bg-gradient-to-r from-[#FFF6E0]/20 to-[#D8D9DA]/20 p-4 rounded-full">
                <Phone size={32} className="text-[#FFF6E0]" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4 text-center">Call Us</h3>
            <p className="text-center text-[#D8D9DA] leading-relaxed">
              +1 (555) 123-4567<br />
              Monday-Friday: 9am-5pm PST
            </p>
          </div>
          
          {/* Contact Card - Email */}
          <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-10px] group" data-aos="fade-up" data-aos-delay="300">
            <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <div className="bg-gradient-to-r from-[#FFF6E0]/20 to-[#D8D9DA]/20 p-4 rounded-full">
                <Mail size={32} className="text-[#FFF6E0]" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4 text-center">Email Us</h3>
            <p className="text-center text-[#D8D9DA] leading-relaxed">
              hello@radialwhisper.com<br />
              support@radialwhisper.com
            </p>
          </div>
        </div>
        
        {/* Contact Form Section */}
        <div className="max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-1 rounded-2xl shadow-xl">
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] rounded-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Form background effect */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#FFF6E0] blur-[100px] opacity-10"></div>
              
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="text-[#FFF6E0]" />
                <h2 className="text-2xl font-bold">Send Us A Message</h2>
                {authUser && (
                  <span className="text-sm bg-[#FFF6E0]/10 text-[#D8D9DA] px-3 py-1 rounded-full ml-2">
                    Welcome back, {authUser?.data?.user?.fullName}
                  </span>
                )}
              </div>
              
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <CheckCircle size={64} className="text-green-400 mb-6" />
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-[#D8D9DA] text-center mb-6">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg"
                  >
                    Send Another Message
                  </button>
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
  disabled={formState.isExistingUser} // Disable field if user is logged in
  className={`w-full bg-[#272829] border border-[#61677A] rounded-lg px-4 py-3 text-[#FFF6E0] placeholder-[#61677A] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/50 transition-all ${
    formState.isExistingUser ? 'opacity-50 cursor-not-allowed' : ''
  }`}
  placeholder="John Doe"
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
  disabled={formState.isExistingUser} // Disable field if user is logged in
  className={`w-full bg-[#272829] border border-[#61677A] rounded-lg px-4 py-3 text-[#FFF6E0] placeholder-[#61677A] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/50 transition-all ${
    formState.isExistingUser ? 'opacity-50 cursor-not-allowed' : ''
  }`}
  placeholder="john@example.com"
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
                      placeholder="How can we help you?"
                    />
                  </div>
                  
                  <div className="mb-8">
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full bg-[#272829] border border-[#61677A] rounded-lg px-4 py-3 text-[#FFF6E0] placeholder-[#61677A] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/50 transition-all resize-none"
                      placeholder="Tell us how we can help..."
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative overflow-hidden bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                    >
                      <span className="relative z-10 flex items-center">
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                        <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingContact;