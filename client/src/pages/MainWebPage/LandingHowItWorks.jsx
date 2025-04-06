import React, { useEffect } from 'react';
import { 
  Radio, 
  Users, 
  Shield, 
  MessageCircle, 
  MapPin, 
  UserPlus, 
  Clock, 
  Zap,
  ChevronRight,
  CheckCircle,
  Lock,
  Search,
  UserCircle,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingHowItWorks = () => {
  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: 'ease-out-cubic',
    });
    
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, []);

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
          <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full mb-6" data-aos="fade-up">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium">How It Works</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight" data-aos="fade-up" data-aos-delay="100">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Experience</span> RadialWhisper
          </h1>
          
          <p className="text-xl text-[#D8D9DA] mb-12 max-w-3xl" data-aos="fade-up" data-aos-delay="200">
            Discover how our proximity-based platform connects you with nearby people while protecting your privacy every step of the way.
          </p>
          
          {/* Step sequence visualization */}
          <div className="w-full relative py-12 mb-16" data-aos="fade-up" data-aos-delay="300">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#31333A] via-[#61677A]/30 to-[#31333A] transform -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {/* Step 1 */}
              <div className="group">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 relative">
                    <div className="w-14 h-14 bg-[#31333A] rounded-full flex items-center justify-center border-2 border-[#61677A] group-hover:border-[#FFF6E0] transition-all z-10">
                      <UserCircle className="h-7 w-7 text-[#FFF6E0]" />
                    </div>
                    <div className="absolute inset-0 bg-[#FFF6E0]/10 rounded-full filter blur-md opacity-0 group-hover:opacity-70 transition-all"></div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Sign Up</h3>
                  <p className="text-sm text-[#D8D9DA]">Create your profile with a bio and choose a unique tag</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="group">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 relative">
                    <div className="w-14 h-14 bg-[#31333A] rounded-full flex items-center justify-center border-2 border-[#61677A] group-hover:border-[#FFF6E0] transition-all z-10">
                      <MapPin className="h-7 w-7 text-[#FFF6E0]" />
                    </div>
                    <div className="absolute inset-0 bg-[#FFF6E0]/10 rounded-full filter blur-md opacity-0 group-hover:opacity-70 transition-all"></div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Set Radius</h3>
                  <p className="text-sm text-[#D8D9DA]">Choose how far you want to discover other users</p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="group">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 relative">
                    <div className="w-14 h-14 bg-[#31333A] rounded-full flex items-center justify-center border-2 border-[#61677A] group-hover:border-[#FFF6E0] transition-all z-10">
                      <MessageCircle className="h-7 w-7 text-[#FFF6E0]" />
                    </div>
                    <div className="absolute inset-0 bg-[#FFF6E0]/10 rounded-full filter blur-md opacity-0 group-hover:opacity-70 transition-all"></div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Chat Anonymously</h3>
                  <p className="text-sm text-[#D8D9DA]">Connect with nearby users through anonymous chat</p>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="group">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 relative">
                    <div className="w-14 h-14 bg-[#31333A] rounded-full flex items-center justify-center border-2 border-[#61677A] group-hover:border-[#FFF6E0] transition-all z-10">
                      <UserPlus className="h-7 w-7 text-[#FFF6E0]" />
                    </div>
                    <div className="absolute inset-0 bg-[#FFF6E0]/10 rounded-full filter blur-md opacity-0 group-hover:opacity-70 transition-all"></div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Form Connections</h3>
                  <p className="text-sm text-[#D8D9DA]">Add contacts and build real connections over time</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Detailed Steps */}
          <div className="space-y-12">
            {/* Step 1: Sign Up & Create Profile */}
            <div className="bg-[#31333A]/30 rounded-xl p-8 border border-[#61677A]/30 backdrop-blur-sm transform transition-all hover:scale-[1.01] hover:bg-[#31333A]/40" data-aos="fade-up">
              <div className="flex items-start gap-6 flex-col md:flex-row">
                <div className="bg-[#FFF6E0]/10 p-4 rounded-full flex-shrink-0">
                  <UserCircle className="h-8 w-8 text-[#FFF6E0]" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#FFF6E0]/10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <h2 className="text-3xl font-bold">Sign Up & Create Profile</h2>
                  </div>
                  
                  <p className="text-[#D8D9DA] leading-relaxed text-lg mb-6">
                    Begin your RadialWhisper journey by creating an account that balances personality with privacy. 
                    Your profile is your introduction to the community, but with privacy controls that put you in charge.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-[#31333A]/50 rounded-lg p-5 border border-[#61677A]/20">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-[#FFF6E0]" />
                        What You'll Need
                      </h3>
                      <ul className="space-y-2 text-[#D8D9DA]">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>Email address and password</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>A brief bio to share your interests</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>Profile picture (optional but recommended)</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#31333A]/50 rounded-lg p-5 border border-[#61677A]/20">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-[#FFF6E0]" />
                        Privacy Features
                      </h3>
                      <ul className="space-y-2 text-[#D8D9DA]">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>Unique anonymous tag for initial interactions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>Control over what information is shared</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>No linking to social media accounts required</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 2: Set Your Radius */}
            <div className="bg-[#31333A]/30 rounded-xl p-8 border border-[#61677A]/30 backdrop-blur-sm transform transition-all hover:scale-[1.01] hover:bg-[#31333A]/40" data-aos="fade-up">
              <div className="flex items-start gap-6 flex-col md:flex-row">
                <div className="bg-[#FFF6E0]/10 p-4 rounded-full flex-shrink-0">
                  <MapPin className="h-8 w-8 text-[#FFF6E0]" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#FFF6E0]/10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <h2 className="text-3xl font-bold">Set Your Radius</h2>
                  </div>
                  
                  <p className="text-[#D8D9DA] leading-relaxed text-lg mb-6">
                    The heart of RadialWhisper is its radius-based discovery system. You decide how far your social circle extends, whether you're looking for an intimate conversation with someone next to you in a coffee shop or connecting with people across a larger venue.
                  </p>
                  
                  <div className="relative w-full h-48 mb-8 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-[#31333A]/70 backdrop-blur-sm border border-[#61677A]/30 rounded-xl"></div>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#31333A]/50 p-4 rounded-lg border border-[#61677A]/20">
                      <div className="text-xl font-bold text-[#FFF6E0]">Intimate (10-50m)</div>
                      <div className="text-sm text-[#D8D9DA] mt-2">Perfect for coffee shops, library study sessions, or small gatherings</div>
                    </div>
                    <div className="bg-[#31333A]/50 p-4 rounded-lg border border-[#61677A]/20">
                      <div className="text-xl font-bold text-[#FFF6E0]">Social (50-500m)</div>
                      <div className="text-sm text-[#D8D9DA] mt-2">Ideal for campuses, office buildings, or neighborhood blocks</div>
                    </div>
                    <div className="bg-[#31333A]/50 p-4 rounded-lg border border-[#61677A]/20">
                      <div className="text-xl font-bold text-[#FFF6E0]">Extended (500m-5km)</div>
                      <div className="text-sm text-[#D8D9DA] mt-2">For large events, conferences, or exploring an entire area</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 3: Discover & Chat Anonymously */}
            <div className="bg-[#31333A]/30 rounded-xl p-8 border border-[#61677A]/30 backdrop-blur-sm transform transition-all hover:scale-[1.01] hover:bg-[#31333A]/40" data-aos="fade-up">
              <div className="flex items-start gap-6 flex-col md:flex-row">
                <div className="bg-[#FFF6E0]/10 p-4 rounded-full flex-shrink-0">
                  <MessageCircle className="h-8 w-8 text-[#FFF6E0]" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#FFF6E0]/10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <h2 className="text-3xl font-bold">Discover & Chat Anonymously</h2>
                  </div>
                  
                  <p className="text-[#D8D9DA] leading-relaxed text-lg mb-6">
                    Once your radius is set, you'll see other RadialWhisper users within your specified distance. 
                    Start anonymous conversations and get to know people nearby without the pressure of revealing your identity.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-[#31333A]/50 rounded-lg p-5 border border-[#61677A]/20">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Search className="h-5 w-5 text-[#FFF6E0]" />
                        Discovery Features
                      </h3>
                      <ul className="space-y-2 text-[#D8D9DA]">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>See how many users are in your radius</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>View bio snippets and tags to find interesting people</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>Real-time updates as people enter or leave your radius</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#31333A]/50 rounded-lg p-5 border border-[#61677A]/20">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Lock className="h-5 w-5 text-[#FFF6E0]" />
                        Chat Privacy
                      </h3>
                      <ul className="space-y-2 text-[#D8D9DA]">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>Messages to nearby users disappear after 1 hour</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>Only your tag and custom bio are visible initially</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>Option to block or report users instantly</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-5 bg-[#31333A]/50 rounded-lg border border-[#61677A]/30">
                    <div className="flex items-center text-[#FFF6E0]">
                      <Zap className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Conversation Starters</span>
                    </div>
                    <p className="mt-2 text-[#D8D9DA]">
                      Not sure how to break the ice? RadialWhisper offers suggested conversation starters based on shared interests or location contexts to help you connect more easily with nearby users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 4: Form Real Connections */}
            <div className="bg-[#31333A]/30 rounded-xl p-8 border border-[#61677A]/30 backdrop-blur-sm transform transition-all hover:scale-[1.01] hover:bg-[#31333A]/40" data-aos="fade-up">
              <div className="flex items-start gap-6 flex-col md:flex-row">
                <div className="bg-[#FFF6E0]/10 p-4 rounded-full flex-shrink-0">
                  <UserPlus className="h-8 w-8 text-[#FFF6E0]" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#FFF6E0]/10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <h2 className="text-3xl font-bold">Form Real Connections</h2>
                  </div>
                  
                  <p className="text-[#D8D9DA] leading-relaxed text-lg mb-6">
                    When you've built enough trust through anonymous chats, you can choose to transition to a more lasting connection. Add someone as a friend to reveal your identities and continue your relationship beyond proximity limits.
                  </p>
                  
                  <div className="bg-[#31333A]/50 p-5 rounded-lg border border-[#61677A]/20 mb-6">
                    <h3 className="font-semibold mb-3">How Friendship Works</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="bg-[#FFF6E0]/10 w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">1</div>
                        <div>
                          <p className="text-[#D8D9DA]">Send a friend request to someone you've been chatting with</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="bg-[#FFF6E0]/10 w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">2</div>
                        <div>
                          <p className="text-[#D8D9DA]">If they accept, you'll both see each other's full profiles</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="bg-[#FFF6E0]/10 w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">3</div>
                        <div>
                          <p className="text-[#D8D9DA]">Friend chats last longer (48 hours) and work regardless of proximity</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="bg-[#FFF6E0]/10 w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">4</div>
                        <div>
                          <p className="text-[#D8D9DA]">Continue building relationships that started with a chance proximity</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-5 bg-[#31333A]/70 rounded-lg border border-[#61677A]/30">
                    <div className="flex items-center text-[#FFF6E0]">
                      <Clock className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Privacy Timer</span>
                    </div>
                    <p className="mt-2 text-[#D8D9DA]">
                      Even with friends, messages aren't permanent. Friend conversations delete after 48 hours, encouraging authentic, in-the-moment interactions while still protecting privacy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 5: Privacy & Safety Controls */}
            <div className="bg-[#31333A]/30 rounded-xl p-8 border border-[#61677A]/30 backdrop-blur-sm transform transition-all hover:scale-[1.01] hover:bg-[#31333A]/40" data-aos="fade-up">
              <div className="flex items-start gap-6 flex-col md:flex-row">
                <div className="bg-[#FFF6E0]/10 p-4 rounded-full flex-shrink-0">
                  <Shield className="h-8 w-8 text-[#FFF6E0]" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#FFF6E0]/10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">5</div>
                    <h2 className="text-3xl font-bold">Privacy & Safety Controls</h2>
                  </div>
                  
                  <p className="text-[#D8D9DA] leading-relaxed text-lg mb-6">
                    At every step, RadialWhisper prioritizes your safety and privacy. You have full control over your experience with comprehensive settings and protection features.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#31333A]/50 rounded-lg p-5 border border-[#61677A]/20">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-[#FFF6E0]" />
                        Control Your Experience
                      </h3>
                      <ul className="space-y-2 text-[#D8D9DA]">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>Adjust your radius anytime based on comfort level</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>Pause discovery when you want privacy</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>Control notification settings</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>Customize your profile visibility</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#31333A]/50 rounded-lg p-5 border border-[#61677A]/20">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-[#FFF6E0]" />
                        Safety Features
                      </h3>
                      <ul className="space-y-2 text-[#D8D9DA]">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>Block and report inappropriate users</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>Content filtering for sensitive material</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>Auto-deletion of messages ensures nothing persists forever</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFF6E0] mt-1">•</span>
                          <span>24/7 moderation and support</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Get Started */}
            <div className="bg-[#31333A]/30 rounded-xl p-8 border border-[#61677A]/30 backdrop-blur-sm transform transition-all hover:scale-[1.01] hover:bg-[#31333A]/40" data-aos="fade-up">
              <div className="flex items-start mb-6">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <ChevronRight className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed text-lg mb-8">
                Join RadialWhisper today and transform how you connect with people in your physical space. Your next meaningful connection could be just a few feet away.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/signup" className="px-6 py-3 bg-[#FFF6E0] text-[#272829] font-semibold rounded-lg hover:bg-[#D8D9DA] transition duration-300 text-center">
                  Sign Up Now
                </Link>
                <Link to="/about" className="px-6 py-3 bg-[#31333A] border border-[#61677A] text-[#FFF6E0] font-semibold rounded-lg hover:bg-[#31333A]/70 transition duration-300 text-center">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHowItWorks;
