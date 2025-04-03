import React from 'react';
import { Radio, Users, Shield, ChevronRight, MapPin, MessageCircle, UserPlus, Zap, Award, Star, Heart, Clock } from 'lucide-react';

const LandingAbout = () => {
  window.scrollTo(0, 0);
  return (
    <div className="min-h-screen bg-[#272829] text-[#FFF6E0] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#272829] opacity-80"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#272829] via-[#31333A] to-transparent opacity-90"></div>
      </div>
      
      {/* Animated floating orbs */}
      <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-60 left-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute top-20 left-1/4 w-40 h-40 rounded-full bg-[#FFF6E0] blur-[80px] opacity-10 animate-pulse"></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full mb-6">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium">About Us</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">RadialWhisper</span>
          </h1>
          
          <p className="text-xl text-[#D8D9DA] mb-12 max-w-3xl">
            Redefining how we connect in a digital world by bringing back the magic of proximity-based interactions.
          </p>
          
          {/* Hero visualization */}
          <div className="relative w-full h-64 mb-16 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-[#31333A]/50 backdrop-blur-sm border border-[#61677A]/30 rounded-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute w-40 h-40 rounded-full border-4 border-[#FFF6E0]/20 animate-ping" style={{animationDuration: '4s'}}></div>
                <div className="absolute w-60 h-60 rounded-full border-2 border-[#FFF6E0]/10 animate-ping" style={{animationDuration: '6s'}}></div>
                <div className="absolute w-80 h-80 rounded-full border border-[#FFF6E0]/5 animate-ping" style={{animationDuration: '8s'}}></div>
                
                <div className="relative z-10 w-20 h-20 rounded-full bg-[#31333A] border-2 border-[#FFF6E0]/30 flex items-center justify-center">
                  <Radio className="h-8 w-8 text-[#FFF6E0]" />
                </div>
                
                {/* Floating user icons */}
                <div className="absolute -top-10 -right-16 w-12 h-12 rounded-full bg-[#31333A] border border-[#FFF6E0]/20 flex items-center justify-center animate-bounce" style={{animationDuration: '3s'}}>
                  <Users className="h-5 w-5 text-[#FFF6E0]/70" />
                </div>
                <div className="absolute top-12 -left-20 w-10 h-10 rounded-full bg-[#31333A] border border-[#FFF6E0]/20 flex items-center justify-center animate-bounce" style={{animationDuration: '4s'}}>
                  <MessageCircle className="h-4 w-4 text-[#FFF6E0]/70" />
                </div>
                <div className="absolute -bottom-8 -right-12 w-14 h-14 rounded-full bg-[#31333A] border border-[#FFF6E0]/20 flex items-center justify-center animate-bounce" style={{animationDuration: '3.5s'}}>
                  <MapPin className="h-6 w-6 text-[#FFF6E0]/70" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-12">
            <div className="bg-[#31333A]/30 rounded-xl p-8 border border-[#61677A]/30 backdrop-blur-sm transform transition-all hover:scale-[1.01] hover:bg-[#31333A]/40">
              <div className="flex items-start mb-6">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Zap className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-3xl font-bold">Our Vision</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed text-lg">
                <span className="text-[#FFF6E0] font-semibold">Imagine being surrounded by potential friends and connections</span> – people who share your physical space but remain strangers. 
                RadialWhisper is designed to bridge this gap by connecting you with nearby individuals through an anonymous, location-based platform that respects your privacy while opening doorways to meaningful interactions.
              </p>
              <p className="text-[#D8D9DA] mt-4 leading-relaxed text-lg">
                We envision a world where technology enhances real-life connections rather than replacing them – where the person sitting next to you at a coffee shop or attending the same event could become a friend or even a lifelong connection.
              </p>
              
              {/* Replace stats with problem statement */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-[#31333A]/50 p-4 rounded-lg border border-[#61677A]/20">
                  <div className="text-xl font-bold text-[#FFF6E0]">The Problem</div>
                  <div className="text-sm text-[#D8D9DA] mt-2">Despite physical proximity, we rarely connect with strangers in our daily environments</div>
                </div>
                <div className="bg-[#31333A]/50 p-4 rounded-lg border border-[#61677A]/20">
                  <div className="text-xl font-bold text-[#FFF6E0]">Our Solution</div>
                  <div className="text-sm text-[#D8D9DA] mt-2">A platform that facilitates anonymous, proximity-based conversations with customizable radius settings</div>
                </div>
                <div className="bg-[#31333A]/50 p-4 rounded-lg border border-[#61677A]/20">
                  <div className="text-xl font-bold text-[#FFF6E0]">The Goal</div>
                  <div className="text-sm text-[#D8D9DA] mt-2">Breaking down social barriers to create meaningful connections in physical spaces</div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-8 border border-[#61677A]/30 backdrop-blur-sm transform transition-all hover:scale-[1.01] hover:bg-[#31333A]/40">
              <div className="flex items-start mb-6">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Users className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-3xl font-bold">Our Story</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed text-lg">
                RadialWhisper began as a solution to a universal human experience: <span className="text-[#FFF6E0] font-semibold">the missed connections all around us</span>. I found myself (Jatin Jaglan) sitting in a crowded university library, surrounded by peers engrossed in their studies and their screens. There was a palpable silence despite the shared experience.
              </p>
              <p className="text-[#D8D9DA] mt-4 leading-relaxed text-lg">
                "What if we could chat with the people around us without the awkwardness of introducing ourselves?" This question sparked the creation of RadialWhisper as my passion project. The concept resonates with a fundamental human need for connection that I believe many people share.
              </p>
              <p className="text-[#D8D9DA] mt-4 leading-relaxed text-lg">
                From initial concept to development, RadialWhisper has been crafted to address the digital isolation we often experience despite being physically surrounded by others.
              </p>
              
              {/* Update timeline to show development phases */}
              <div className="mt-8 relative border-l-2 border-[#61677A]/40 pl-8 space-y-6">
                <div className="relative">
                  <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-[#FFF6E0]"></div>
                  <div className="text-[#FFF6E0] font-semibold">Concept</div>
                  <div className="text-[#D8D9DA]">The idea of RadialWhisper is born from personal experience</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-[#FFF6E0]"></div>
                  <div className="text-[#FFF6E0] font-semibold">Development</div>
                  <div className="text-[#D8D9DA]">Building the platform with privacy and user experience as priorities</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-[#FFF6E0]"></div>
                  <div className="text-[#FFF6E0] font-semibold">Time To Use</div>
                  <div className="text-[#D8D9DA]">The RadialWhisper, concept to reality</div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-8 border border-[#61677A]/30 backdrop-blur-sm transform transition-all hover:scale-[1.01] hover:bg-[#31333A]/40">
              <div className="flex items-start mb-6">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Shield className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-3xl font-bold">How It Will Work</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#31333A] border border-[#61677A] flex items-center justify-center">
                    <MapPin className="h-7 w-7 text-[#FFF6E0]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#FFF6E0]">Discover Nearby</h3>
                  <p className="text-[#D8D9DA]">Set your preferred radius and discover other users in your vicinity, without revealing exact locations.</p>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#31333A] border border-[#61677A] flex items-center justify-center">
                    <MessageCircle className="h-7 w-7 text-[#FFF6E0]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#FFF6E0]">Chat Anonymously</h3>
                  <p className="text-[#D8D9DA]">Connect through anonymous chats where only your bio and uniquely generated tag are visible.</p>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#31333A] border border-[#61677A] flex items-center justify-center">
                    <UserPlus className="h-7 w-7 text-[#FFF6E0]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#FFF6E0]">Form Connections</h3>
                  <p className="text-[#D8D9DA]">When you're ready, add each other as friends to reveal identities and continue the connection beyond proximity.</p>
                </div>
              </div>
              
              <div className="mt-10 p-5 bg-[#31333A]/50 rounded-lg border border-[#61677A]/30">
                <div className="flex items-center text-[#FFF6E0]">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Privacy by Design</span>
                </div>
                <p className="mt-2 text-[#D8D9DA]">
                  Messages will automatically delete (after 1 hour for nearby chats, 48 hours for friends) to protect your privacy and create space for authentic, in-the-moment connections.
                </p>
              </div>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-8 border border-[#61677A]/30 backdrop-blur-sm transform transition-all hover:scale-[1.01] hover:bg-[#31333A]/40">
              <div className="flex items-start mb-6">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Star className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-3xl font-bold">Core Values & Features</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#31333A]/40 p-6 rounded-lg border border-[#61677A]/20">
                  <h3 className="text-lg font-bold text-[#FFF6E0] mb-3 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Privacy First
                  </h3>
                  <p className="text-[#D8D9DA]">
                    We're building RadialWhisper with privacy as a fundamental principle. Your identity remains anonymous until you choose to reveal it, and all messages have automatic deletion timeframes to ensure your conversations remain ephemeral and private.
                  </p>
                </div>
                
                <div className="bg-[#31333A]/40 p-6 rounded-lg border border-[#61677A]/20">
                  <h3 className="text-lg font-bold text-[#FFF6E0] mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Meaningful Connections
                  </h3>
                  <p className="text-[#D8D9DA]">
                    RadialWhisper is designed to foster genuine human connections rather than superficial interactions. By connecting people in the same physical space, we aim to create opportunities for relationships that might have real-world continuity.
                  </p>
                </div>
                
                <div className="bg-[#31333A]/40 p-6 rounded-lg border border-[#61677A]/20">
                  <h3 className="text-lg font-bold text-[#FFF6E0] mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Custom Radius Control
                  </h3>
                  <p className="text-[#D8D9DA]">
                    You'll have complete control over your discovery radius, allowing you to expand or contract your social circle based on your comfort level and current environment – whether you're in a coffee shop (small radius) or at a large event (wider radius).
                  </p>
                </div>
                
                <div className="bg-[#31333A]/40 p-6 rounded-lg border border-[#61677A]/20">
                  <h3 className="text-lg font-bold text-[#FFF6E0] mb-3 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    In Development: Enhanced Filters
                  </h3>
                  <p className="text-[#D8D9DA]">
                    We're working on interest-based filtering to help you find people with common hobbies, professional backgrounds, or conversation topics, making your proximity-based connections even more relevant and meaningful.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-5 bg-[#31333A]/70 rounded-lg border border-[#61677A]/30">
                <h3 className="text-lg font-bold text-[#FFF6E0] mb-2">Our Development Philosophy</h3>
                <p className="text-[#D8D9DA]">
                  RadialWhisper is being developed with an iterative approach, focusing on user feedback and continuous improvement. We believe in building technology that enhances human connection rather than replacing it, and every feature is designed with this principle in mind.
                </p>
              </div>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-8 border border-[#61677A]/30 backdrop-blur-sm transform transition-all hover:scale-[1.01] hover:bg-[#31333A]/40">
              <div className="flex items-start mb-6">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <ChevronRight className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-3xl font-bold">Join Our Journey</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed text-lg">
                RadialWhisper is set to launch soon, and we're excited to redefine how people connect in the digital age by bringing back the magic of proximity-based interactions. With RadialWhisper, your next meaningful connection could be just a few feet away.
              </p>
              <p className="text-[#D8D9DA] leading-relaxed text-lg mt-4">
                Be among the first to experience this new way of connecting. Sign up now to receive launch notifications and get early access.
              </p>
              <div className="mt-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <a href="/signup" className="px-6 py-3 bg-[#FFF6E0] text-[#272829] font-semibold rounded-lg hover:bg-[#D8D9DA] transition duration-300 text-center">
                  Get Early Access
                </a>
                <a href="/contact" className="px-6 py-3 bg-[#31333A] border border-[#61677A] text-[#FFF6E0] font-semibold rounded-lg hover:bg-[#31333A]/70 transition duration-300 text-center">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
          
          {/* Visual element */}
          <div className="relative mx-auto w-40 h-40 mt-16">
            <div className="absolute inset-0 bg-gradient-to-r from-[#61677A]/30 to-[#D8D9DA]/30 rounded-full opacity-60 blur-xl"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="absolute w-full h-full rounded-full border-4 border-[#61677A]/40 animate-ping" style={{animationDuration: '3s'}}></div>
              <div className="absolute w-3/4 h-3/4 rounded-full border-4 border-[#FFF6E0]/30"></div>
              <div className="absolute w-1/2 h-1/2 rounded-full border-4 border-[#FFF6E0]/20"></div>
              <Radio size={40} className="text-[#FFF6E0] animate-pulse" style={{animationDuration: '2s'}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingAbout;