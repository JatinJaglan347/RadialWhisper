import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Shield, 
  MessageSquare, 
  Users, 
  ChevronRight,
  Radio,
  Lock,
  Zap,
  Star,
  ArrowRight,
  Smartphone,
  BellRing
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import LandingFooter from '../../componenst/MainWebPage/LandingFooter';
import LandingNavbar from '../../componenst/MainWebPage/LandingNavbar';

function LandingHome() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100
    });
    
    // Parallax effect on scroll
    const handleScroll = () => {
      const parallaxElements = document.querySelectorAll('.parallax');
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.5;
        const yPos = -(window.scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#272829] text-[#FFF6E0] overflow-hidden">
      <LandingNavbar />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Dynamic background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#272829] opacity-80"></div>
          {/* City background with subtle blur for hero section */}
          <div className="absolute inset-0 bg-[url('/src/assets/images/city-background.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#272829] via-[#31333A] to-transparent opacity-90"></div>
        </div>
        
        {/* Animated floating orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-30 animate-pulse" style={{animationDuration: '7s'}}></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-20 animate-pulse" style={{animationDuration: '10s'}}></div>
        <div className="absolute top-40 left-1/4 w-40 h-40 rounded-full bg-[#FFF6E0] blur-[80px] opacity-10 animate-pulse" style={{animationDuration: '8s'}}></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 mb-16 md:mb-0" data-aos="fade-right">
              <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full mb-6">
                <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium">New Release v2.0</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                Connect with people <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">nearby</span>
              </h1>
              
              <p className="text-xl mb-8 text-[#D8D9DA] max-w-lg leading-relaxed">
                RadialWhisper lets you chat anonymously with people within your custom radius.
                Adjust your connection range and start chatting today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="group relative overflow-hidden btn bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl">
                  <span className="relative z-10">Get Started</span>
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </Link>
                
                <Link to="/features" className="btn btn-outline text-[#FFF6E0] border-[#FFF6E0] hover:bg-[#FFF6E0] hover:text-[#272829] hover:border-[#FFF6E0] px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-md">
                  Learn More
                </Link>
              </div>
              
              {/* User stats */}
              <div className="flex mt-12 gap-8">
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">500K+</p>
                  <p className="text-sm text-[#D8D9DA]">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">4.8/5</p>
                  <p className="text-sm text-[#D8D9DA]">App Rating</p>
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">50+</p>
                  <p className="text-sm text-[#D8D9DA]">Countries</p>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 relative" data-aos="fade-up" data-aos-delay="200">
              <div className="relative">
                {/* Glow effect behind phone */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#61677A] to-[#D8D9DA] rounded-2xl opacity-30 blur-xl transform translate-x-2 translate-y-2"></div>
                
                {/* Phone mockup with app interface */}
                <div className="relative overflow-hidden rounded-2xl border border-[#61677A]/30 shadow-2xl">
                  <img 
                    src="/src/assets/images/app-interface-map.jpg" 
                    alt="RadialWhisper App Interface" 
                    className="w-full h-auto rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#272829] to-transparent opacity-40"></div>
                </div>
                
                {/* Floating UI elements */}
                <div className="absolute -top-8 -right-4 bg-[#FFF6E0] text-[#272829] p-4 rounded-lg shadow-lg transform rotate-6 animate-pulse" style={{animationDuration: '3s'}}>
                  <p className="text-sm font-medium">Hey there!</p>
                </div>
                <div className="absolute -bottom-5 -left-5 bg-[#61677A] text-[#FFF6E0] p-4 rounded-lg shadow-lg transform -rotate-3 animate-pulse" style={{animationDuration: '4s'}}>
                  <p className="text-sm font-medium">Anyone at the concert?</p>
                </div>
                
                {/* Animated notification */}
                <div className="absolute top-1/4 right-0 transform translate-x-1/2 bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] p-3 rounded-full shadow-lg flex items-center justify-center animate-bounce" style={{animationDuration: '2s'}}>
                  <BellRing size={24} />
                </div>
                
                {/* Status indicators */}
                <div className="absolute bottom-12 right-8 flex items-center gap-2 bg-[#272829]/80 backdrop-blur-sm px-3 py-1 rounded-full border border-[#61677A]/50">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-xs text-[#FFF6E0]">15 users nearby</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Curved wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-32">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,96,0,64V56.44Z" fill="#61677A"></path>
          </svg>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="bg-gradient-to-b from-[#61677A] to-[#4d525f] py-24 md:py-32 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, #FFF6E0 1px, transparent 1px), linear-gradient(to bottom, #FFF6E0 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20" data-aos="fade-up">
            <span className="bg-[#272829]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">Simple Process</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">How RadialWhisper Works</h2>
            <p className="text-xl max-w-3xl mx-auto text-[#FFF6E0]/90">Connect with people nearby in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-10px] group" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] w-16 h-16 flex items-center justify-center rounded-full mb-8 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">1</div>
              <div className="flex justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Radio size={56} className="text-[#FFF6E0]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Set Your Radius</h3>
              <p className="text-center text-[#D8D9DA] leading-relaxed">Adjust your location radius to determine how far your chat reach extends. You control your connections.</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-10px] group" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] w-16 h-16 flex items-center justify-center rounded-full mb-8 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">2</div>
              <div className="flex justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Users size={56} className="text-[#FFF6E0]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Discover People</h3>
              <p className="text-center text-[#D8D9DA] leading-relaxed">Find others within your radius. View only their profile picture, gender, and bio.</p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-10px] group" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] w-16 h-16 flex items-center justify-center rounded-full mb-8 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">3</div>
              <div className="flex justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare size={56} className="text-[#FFF6E0]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Start Chatting</h3>
              <p className="text-center text-[#D8D9DA] leading-relaxed">Connect anonymously with people nearby without sharing personal details. Build real connections.</p>
            </div>
          </div>
          
          {/* Call to action */}
          <div className="text-center mt-16" data-aos="fade-up">
            <Link to="/how-it-works" className="inline-flex items-center text-lg font-medium text-[#FFF6E0] hover:text-[#D8D9DA] transition-colors">
              Learn more about how it works
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        
        {/* Diagonal divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-32">
            <path d="M1200 120L0 16.48V0h1200v120z" fill="#272829"></path>
          </svg>
        </div>
      </div>
      
      {/* App Preview Section */}
      <div className="py-24 md:py-36 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-40 left-0 w-96 h-96 rounded-full bg-[#61677A] blur-[150px] opacity-20 parallax" data-speed="0.3"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-10 parallax" data-speed="0.2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-16 md:mb-0 relative" data-aos="fade-right">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#61677A] to-[#D8D9DA] rounded-lg opacity-30 blur-xl transform -translate-x-2 translate-y-2"></div>
                
                {/* First phone */}
                <div className="relative md:absolute md:transform md:rotate-6 md:translate-x-8 md:z-10 rounded-2xl border border-[#61677A]/30 shadow-2xl transition-all duration-500 hover:rotate-0 hover:scale-105">
                  <img 
                    src="/src/assets/images/app-screen-chat.jpg" 
                    alt="RadialWhisper Mobile App" 
                    className="w-full h-auto rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#272829] to-transparent opacity-40 rounded-2xl"></div>
                  
                  {/* UI elements */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-[#FFF6E0]/10 backdrop-blur-md px-4 py-2 rounded-full border border-[#FFF6E0]/30">
                    <p className="text-sm text-[#FFF6E0] font-medium">5 people within 100m</p>
                  </div>
                </div>
                
                {/* Second phone */}
                <div className="hidden md:block absolute top-8 -left-12 transform -rotate-6 rounded-2xl border border-[#61677A]/30 shadow-2xl transition-all duration-500 hover:rotate-0 hover:scale-105">
                  <img 
                    src="/src/assets/images/app-screen-profile.jpg" 
                    alt="RadialWhisper Mobile App Alternative View" 
                    className="w-full h-auto rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#272829] to-transparent opacity-40 rounded-2xl"></div>
                  
                  {/* Chat UI element */}
                  <div className="absolute bottom-16 inset-x-4 bg-[#272829]/80 backdrop-blur-md p-3 rounded-xl border border-[#61677A]/30">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#61677A] flex-shrink-0 overflow-hidden">
                        <img src="/src/assets/images/user-avatar.jpg" alt="User" className="w-full h-full object-cover" />
                      </div>
                      <div className="bg-[#61677A]/50 px-3 py-2 rounded-lg max-w-[80%]">
                        <p className="text-sm text-[#FFF6E0]">Hey! Are you at the north entrance?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 md:pl-16" data-aos="fade-left" data-aos-delay="200">
              <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">Proximity Chat</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Proximity-based</span> communication
              </h2>
              <p className="text-lg mb-8 text-[#D8D9DA] leading-relaxed">
                RadialWhisper revolutionizes how we connect with people around us. Whether you're at a 
                concert, coffee shop, or college campus, discover and chat with people nearby.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 bg-gradient-to-br from-[#61677A] to-[#4d525f] p-4 rounded-xl shadow-lg">
                    <MapPin className="h-6 w-6 text-[#FFF6E0]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Location-Based Discovery</h3>
                    <p className="text-[#D8D9DA] leading-relaxed">See and connect with users within your customizable radius. You control how far your reach extends.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 bg-gradient-to-br from-[#61677A] to-[#4d525f] p-4 rounded-xl shadow-lg">
                    <Shield className="h-6 w-6 text-[#FFF6E0]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Privacy Protected</h3>
                    <p className="text-[#D8D9DA] leading-relaxed">Your personal information stays private. Only your profile picture, gender, and bio are visible to others.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 bg-gradient-to-br from-[#61677A] to-[#4d525f] p-4 rounded-xl shadow-lg">
                    <Zap className="h-6 w-6 text-[#FFF6E0]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
                    <p className="text-[#D8D9DA] leading-relaxed">As people enter or leave your radius, your available connections update instantly.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <Link to="/features" className="inline-flex items-center px-6 py-3 rounded-full bg-[#61677A]/30 hover:bg-[#61677A]/50 text-[#FFF6E0] font-medium transition-all duration-300 border border-[#FFF6E0]/20 hover:border-[#FFF6E0]/40">
                  Explore all features
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Overview */}
      <div className="bg-gradient-to-b from-[#31333A] to-[#272829] py-24 md:py-36 relative">
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-32">
            <path d="M1200 0L0 60V0h1200z" fill="#272829"></path>
          </svg>
        </div>
        
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
          <div className="text-center mb-20" data-aos="fade-up">
            <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">Key Features</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Why Choose RadialWhisper?</h2>
            <p className="text-lg max-w-3xl mx-auto text-[#D8D9DA]">Our unique features make connecting with people nearby safe and fun</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="flex flex-col md:flex-row gap-8 group" data-aos="fade-up" data-aos-delay="100">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-[#61677A] to-[#4d525f] w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Radio size={40} className="text-[#FFF6E0]" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Customizable Radius</h3>
                <p className="text-[#D8D9DA] leading-relaxed">Adjust your chat radius to connect with people at your preferred distance - from a few meters to several kilometers. Perfect for both intimate gatherings and larger events.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 group" data-aos="fade-up" data-aos-delay="200">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-[#61677A] to-[#4d525f] w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Lock size={40} className="text-[#FFF6E0]" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Privacy Protection</h3>
                <p className="text-[#D8D9DA] leading-relaxed">Chat anonymously without revealing personal details. Only share what you're comfortable with. Your exact location is never shared with other users.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 group" data-aos="fade-up" data-aos-delay="300">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-[#61677A] to-[#4d525f] w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare size={40} className="text-[#FFF6E0]" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Real-time Chat</h3>
                <p className="text-[#D8D9DA] leading-relaxed">Enjoy seamless, instant messaging with people in your vicinity. Connect immediately as they enter your radius with instant notifications and smooth messaging.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 group" data-aos="fade-up" data-aos-delay="400">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-[#61677A] to-[#4d525f] w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users size={40} className="text-[#FFF6E0]" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Meet New People</h3>
                <p className="text-[#D8D9DA] leading-relaxed">Discover new connections based on proximity. Perfect for making friends in a new area or at events. Find people with similar interests through our optional interest matching.</p>
              </div>
            </div>
          </div>
          
          {/* Feature showcase */}
          <div className="mt-24 p-6 md:p-10 bg-gradient-to-br from-[#272829] to-[#31333A] rounded-2xl border border-[#61677A]/30 shadow-2xl relative overflow-hidden" data-aos="fade-up">
            {/* Background shapes */}
            <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-[#61677A]/10 blur-lg"></div>
            <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-[#FFF6E0]/5 blur-xl"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="md:w-1/2">
                <span className="bg-[#FFF6E0]/10 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">Featured</span>
                <h3 className="text-3xl font-bold mb-6">Exclusive Premium Features</h3>
                <p className="text-[#D8D9DA] mb-8 leading-relaxed">
                  Upgrade to RadialWhisper Premium to unlock advanced features for even better connections.
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] w-6 h-6 rounded-full flex items-center justify-center">
                      <Star size={12} className="text-[#272829]" />
                    </div>
                    <span className="text-[#FFF6E0]">Extended radius options up to 5km</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] w-6 h-6 rounded-full flex items-center justify-center">
                      <Star size={12} className="text-[#272829]" />
                    </div>
                    <span className="text-[#FFF6E0]">Advanced profile customization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] w-6 h-6 rounded-full flex items-center justify-center">
                      <Star size={12} className="text-[#272829]" />
                    </div>
                    <span className="text-[#FFF6E0]">Create and join interest-based groups</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] w-6 h-6 rounded-full flex items-center justify-center">
                      <Star size={12} className="text-[#272829]" />
                    </div>
                    <span className="text-[#FFF6E0]">Ad-free experience</span>
                  </li>
                </ul>
                
                <div className="mt-8">
                  <Link to="/premium" className="btn bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] px-6 py-3 rounded-full font-medium transition-all duration-300 inline-flex items-center">
                    Get Premium
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
              
              <div className="md:w-1/2 relative">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFF6E0]/30 to-[#D8D9DA]/30 rounded-lg opacity-30 blur-xl transform translate-x-2 translate-y-2"></div>
                  
                  {/* Phone mockup */}
                  <div className="relative rounded-2xl border border-[#61677A]/30 shadow-2xl overflow-hidden">
                    <img 
                      src="/api/placeholder/500/300" 
                      alt="RadialWhisper Premium Features" 
                      className="w-full h-auto rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#272829] to-transparent opacity-40"></div>
                    
                    {/* Premium badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      PREMIUM
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="py-24 md:py-32 relative">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#61677A] blur-[150px] opacity-10 parallax" data-speed="0.2"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-10 parallax" data-speed="0.3"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20" data-aos="fade-up">
            <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">Testimonials</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">What Our Users Say</h2>
            <p className="text-lg max-w-3xl mx-auto text-[#D8D9DA]">Join thousands of happy users creating meaningful connections</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl border border-[#61677A]/30 shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-5px]" data-aos="fade-up" data-aos-delay="100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  <img src="/api/placeholder/100/100" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Sarah T.</h4>
                  <p className="text-sm text-[#D8D9DA]">New York, NY</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-[#FFF6E0]" fill="#FFF6E0" />
                ))}
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                "RadialWhisper helped me meet amazing people at a music festival. I connected with others who shared my taste in music, and we ended up enjoying the concert together. Now we're friends who meet regularly!"
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl border border-[#61677A]/30 shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-5px]" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  <img src="/api/placeholder/100/100" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Michael R.</h4>
                  <p className="text-sm text-[#D8D9DA]">London, UK</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-[#FFF6E0]" fill="#FFF6E0" />
                ))}
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                "As a frequent traveler, RadialWhisper has been a game changer. I've connected with locals who gave me incredible recommendations and showed me the authentic side of cities I visit. The privacy features make me feel safe."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl border border-[#61677A]/30 shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-5px]" data-aos="fade-up" data-aos-delay="300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  <img src="/api/placeholder/100/100" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Jamie L.</h4>
                  <p className="text-sm text-[#D8D9DA]">Sydney, AU</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-[#FFF6E0]" fill="#FFF6E0" />
                ))}
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                "I moved to a new city and was having trouble making friends. RadialWhisper helped me connect with people in my neighborhood who had similar interests. The customizable radius is perfect for finding people nearby."
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Download CTA */}
      <div className="bg-gradient-to-br from-[#61677A] to-[#4d525f] py-20 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, #FFF6E0 1px, transparent 1px), linear-gradient(to bottom, #FFF6E0 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="md:w-1/2" data-aos="fade-right">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Download RadialWhisper Today</h2>
              <p className="text-xl mb-8 text-[#FFF6E0]/90 leading-relaxed">
                Join over 500,000 users who are already connecting with people nearby. Available on iOS and Android.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/download/ios" className="btn bg-[#272829] hover:bg-[#31333A] text-[#FFF6E0] px-6 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-3">
                  <Smartphone size={24} />
                  <span>
                    <span className="text-xs block">Download on the</span>
                    <span className="font-semibold">App Store</span>
                  </span>
                </Link>
                
                <Link to="/download/android" className="btn bg-[#272829] hover:bg-[#31333A] text-[#FFF6E0] px-6 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-3">
                  <Smartphone size={24} />
                  <span>
                    <span className="text-xs block">Get it on</span>
                    <span className="font-semibold">Google Play</span>
                  </span>
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center" data-aos="fade-left">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-[#FFF6E0]/20 blur-2xl rounded-full transform scale-150"></div>
                
                <img 
                  src="/api/placeholder/400/200" 
                  alt="RadialWhisper Mobile App" 
                  className="relative z-10 max-w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="py-24 md:py-32 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">FAQ</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-lg max-w-3xl mx-auto text-[#D8D9DA]">Everything you need to know about RadialWhisper</p>
          </div>
          
          <div className="space-y-6" data-aos="fade-up" data-aos-delay="100">
            {/* FAQ Item 1 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] rounded-xl border border-[#61677A]/30 shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">How does RadialWhisper protect my privacy?</h3>
                <p className="text-[#D8D9DA] leading-relaxed">
                  RadialWhisper never shares your exact location with other users. We only show that you're within the radius they've set. Your personal details remain private unless you choose to share them. All chats are end-to-end encrypted for maximum security.
                </p>
              </div>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] rounded-xl border border-[#61677A]/30 shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">What's the maximum radius I can set?</h3>
                <p className="text-[#D8D9DA] leading-relaxed">
                  Free accounts can set a radius up to 1km. Premium subscribers can extend this to 5km, perfect for covering larger areas like campuses, festivals, or neighborhoods.
                </p>
              </div>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] rounded-xl border border-[#61677A]/30 shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Can I block users I don't want to interact with?</h3>
                <p className="text-[#D8D9DA] leading-relaxed">
                  Absolutely! You can block any user at any time. Once blocked, they won't be able to see your profile or send you messages, even if you're in the same location.
                </p>
              </div>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] rounded-xl border border-[#61677A]/30 shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Is RadialWhisper available worldwide?</h3>
                <p className="text-[#D8D9DA] leading-relaxed">
                  Yes! RadialWhisper is available in over 50 countries and supports multiple languages. Our user base is growing globally, making it useful for travelers and locals alike.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12" data-aos="fade-up">
            <Link to="/faq" className="inline-flex items-center text-lg font-medium text-[#FFF6E0] hover:text-[#D8D9DA] transition-colors">
              View all FAQs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Newsletter */}
      <div className="bg-gradient-to-br from-[#272829] to-[#31333A] py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-[#61677A] to-[#4d525f] p-8 md:p-12 rounded-2xl shadow-2xl border border-[#FFF6E0]/10 relative overflow-hidden" data-aos="fade-up">
            {/* Background elements */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#FFF6E0]/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#FFF6E0]/5 blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Connected</h2>
                <p className="text-lg text-[#FFF6E0]/90 max-w-2xl mx-auto">
                  Subscribe to our newsletter for updates, tips on making the most of RadialWhisper, and exclusive offers.
                </p>
              </div>
              
              <form className="max-w-xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-grow px-6 py-4 rounded-full bg-[#272829]/80 text-[#FFF6E0] border border-[#FFF6E0]/20 focus:border-[#FFF6E0]/50 focus:outline-none"
                  />
                  <button type="submit" className="btn bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg">
                    Subscribe
                  </button>
                </div>
                <p className="text-sm text-[#FFF6E0]/70 text-center mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      
   <LandingFooter/>
    </div>
  );
}

export default LandingHome;