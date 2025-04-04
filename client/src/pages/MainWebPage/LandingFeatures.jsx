import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Users, 
  Shield, 
  MessageCircle, 
  MapPin, 
  UserPlus, 
  Zap, 
  Clock, 
  Smartphone, 
  Lock, 
  Search, 
  BellRing, 
  Star, 
  ChevronRight, 
  ArrowRight,
  Check,
  MousePointer
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingFeatures = () => {
  // State for active feature
  const [activeFeature, setActiveFeature] = useState('proximity');
  
  // State for progress through features
  const [interactionProgress, setInteractionProgress] = useState(0);
  
  // Define features
  const features = {
    proximity: {
      title: "Proximity-Based Discovery",
      description: "Connect with people nearby using our customizable radius settings. From intimate spaces to wider areas, you control how far your reach extends.",
      icon: <Radio />,
      color: "from-blue-400 to-indigo-600",
      details: [
        "Set your radius from 10m to 1km (or up to 5km with premium)",
        "See real-time updates as people enter or leave your radius",
        "Specify exact locations like coffee shops or events",
        "No exact location sharing – only proximity information"
      ]
    },
    privacy: {
      title: "Privacy First Design",
      description: "Your identity remains anonymous until you choose to reveal it. We've built a platform where you control how much you share.",
      icon: <Shield />,
      color: "from-emerald-400 to-teal-600",
      details: [
        "Ephemeral messages that automatically delete (1 hour for nearby users, 48 hours for friends)",
        "Only your profile picture, uniquely generated tag and bio are visible",
        "No access to your contacts or personal data",
      ]
    },
    realtime: {
      title: "Real-Time Messaging",
      description: "Enjoy seamless, instant communications with people in your vicinity with our lightning-fast messaging system.",
      icon: <MessageCircle />,
      color: "from-amber-400 to-orange-600",
      details: [
        "Instant message delivery with typing indicators",
        "Send text, emojis, and reactions",
        "Message status indicators",
        "Push notifications for new messages"
      ]
    },
    radius: {
      title: "Custom Radius Control",
      description: "Fine-tune your discovery radius based on your environment and preferences – from intimate settings to larger areas.",
      icon: <Search />,
      color: "from-purple-400 to-pink-600",
      details: [
        "Simple slider interface for adjusting radius",
        "Save favorite radius settings for different locations",
        "Visual map representation of your current radius",
        "Filter users within your radius based on interests"
      ]
    },
    connections: {
      title: "Meaningful Connections",
      description: "Move beyond superficial interactions. RadialWhisper is designed to foster genuine human connections in shared physical spaces.",
      icon: <Users />,
      color: "from-rose-400 to-red-600",
      details: [
        "Optional interest matching to find like-minded people",
        "Add people as friends to maintain connections beyond proximity",
        "Create group chats with people in the same vicinity",
        "Share your experiences and discover common interests"
      ]
    },
    mobile: {
      title: "Cross-Platform Access",
      description: "Access RadialWhisper from any device. Our platform works seamlessly on mobile and desktop browsers.",
      icon: <Smartphone />,
      color: "from-cyan-400 to-blue-600",
      details: [
        "Responsive design that works on any device",
        "Progressive Web App (PWA) capabilities",
        "Consistent experience across platforms",
        "Native app experience in your browser"
      ]
    }
  };

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: 'ease-out-cubic',
    });
    
    window.scrollTo(0, 0);
    
    // Set up a timer to cycle through features for visual interest
    const timer = setInterval(() => {
      setInteractionProgress(prev => {
        const newProgress = (prev + 1) % 100;
        return newProgress;
      });
    }, 300);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    // Refresh AOS animations when active feature changes
    AOS.refresh();
  }, [activeFeature]);

  // Function to render animated feature demo based on active feature
  const renderFeatureDemo = () => {
    switch(activeFeature) {
      case 'proximity':
        return (
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="absolute w-40 h-40 rounded-full border-2 border-[#FFF6E0]/10"></div>
            <div className="absolute" style={{width: `${60 + (interactionProgress % 40)}%`, height: `${60 + (interactionProgress % 40)}%`, borderRadius: '100%', border: '2px solid rgba(255, 246, 224, 0.2)', transition: 'all 0.3s ease'}}></div>
            <div className="absolute" style={{width: `${30 + (interactionProgress % 20)}%`, height: `${30 + (interactionProgress % 20)}%`, borderRadius: '100%', border: '2px solid rgba(255, 246, 224, 0.3)', transition: 'all 0.3s ease'}}></div>
            
            <div className="w-12 h-12 rounded-full bg-[#31333A] border-2 border-[#FFF6E0]/30 flex items-center justify-center z-10">
              <Radio className="h-6 w-6 text-[#FFF6E0]" />
            </div>
            
            {/* User dots */}
            <div className="absolute top-1/4 right-1/3 w-5 h-5 rounded-full bg-[#FFF6E0]/70 animate-pulse"></div>
            <div className="absolute bottom-1/3 left-1/4 w-4 h-4 rounded-full bg-[#FFF6E0]/60 animate-pulse"></div>
            <div className="absolute top-1/2 left-2/3 w-6 h-6 rounded-full bg-[#FFF6E0]/80 animate-pulse"></div>
          </div>
        );
      case 'privacy':
        return (
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-[#31333A] border-2 border-[#FFF6E0]/10 flex items-center justify-center">
                <Shield className="h-16 w-16 text-[#FFF6E0]/30" />
              </div>
            </div>
            
            {/* Message bubbles that disappear */}
            <div className="absolute top-10 right-16 bg-[#FFF6E0]/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#FFF6E0]/20 text-sm"
              style={{opacity: interactionProgress > 50 ? 0 : 1, transition: 'opacity 0.5s ease'}}>
              Hello there!
            </div>
            <div className="absolute bottom-12 left-10 bg-[#FFF6E0]/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#FFF6E0]/20 text-sm"
              style={{opacity: (interactionProgress > 70 || interactionProgress < 20) ? 0 : 1, transition: 'opacity 0.5s ease'}}>
              What's up?
            </div>
            
            <div className="absolute top-1/2 left-1/6 bg-[#31333A] p-2 rounded-full animate-pulse" style={{animationDuration: '3s'}}>
              <Lock className="h-5 w-5 text-[#FFF6E0]" />
            </div>
          </div>
        );
      case 'realtime':
        return (
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="max-w-xs bg-[#31333A] rounded-xl p-4 border border-[#61677A]/30">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#61677A]/50 flex-shrink-0"></div>
                <div className="bg-[#61677A]/30 px-3 py-2 rounded-lg">
                  <p className="text-sm">Hey there! How's it going?</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-[#FFF6E0]/10 px-3 py-2 rounded-lg">
                  <p className="text-sm">
                    Great thanks! Are you at the event?
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FFF6E0]/20 flex-shrink-0"></div>
              </div>
              
              {/* Typing indicator */}
              <div className="flex items-center gap-1 mt-4 ml-11" style={{opacity: (interactionProgress % 100) > 50 ? 1 : 0, transition: 'opacity 0.3s ease'}}>
                <div className="w-2 h-2 rounded-full bg-[#FFF6E0]/50 animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 rounded-full bg-[#FFF6E0]/50 animate-bounce" style={{animationDelay: '200ms'}}></div>
                <div className="w-2 h-2 rounded-full bg-[#FFF6E0]/50 animate-bounce" style={{animationDelay: '400ms'}}></div>
              </div>
            </div>
          </div>
        );
      case 'radius':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div className="w-full max-w-xs">
              <div className="mb-4 text-center">
                <span className="text-sm text-[#D8D9DA]">Current radius:</span>
                <span className="text-xl font-bold ml-2">{100 + Math.floor(interactionProgress * 4)}m</span>
              </div>
              
              <div className="w-full h-2 bg-[#61677A]/30 rounded-full mb-8 relative">
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full flex justify-between px-1">
                  <span className="text-xs text-[#D8D9DA]/50">10m</span>
                  <span className="text-xs text-[#D8D9DA]/50">1km</span>
                </div>
                <div className="h-full bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] rounded-full" style={{width: `${interactionProgress}%`}}></div>
                <div className="absolute -top-1 h-4 w-4 rounded-full bg-[#FFF6E0] transform -translate-y-1/2" style={{left: `${interactionProgress}%`}}></div>
              </div>
              
              <div className="relative w-full h-24">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#31333A] border-2 border-[#FFF6E0]/30 flex items-center justify-center z-10">
                    <MapPin className="h-6 w-6 text-[#FFF6E0]" />
                  </div>
                  
                  <div className="absolute rounded-full border-2 border-[#FFF6E0]/20" style={{
                    width: `${120 * (interactionProgress/100)}px`, 
                    height: `${120 * (interactionProgress/100)}px`,
                    transition: 'all 0.3s ease'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'connections':
        return (
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="flex items-center justify-center gap-10 relative">
              {/* Central user */}
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-full bg-[#31333A] border-2 border-[#FFF6E0]/50 flex items-center justify-center">
                  <Users className="h-7 w-7 text-[#FFF6E0]" />
                </div>
                
                {/* Connection lines */}
                <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10" width="300" height="200">
                  <line x1="0" y1="0" x2="-80" y2="-50" stroke="rgba(255, 246, 224, 0.2)" strokeWidth="1" />
                  <line x1="0" y1="0" x2="80" y2="-40" stroke="rgba(255, 246, 224, 0.2)" strokeWidth="1" />
                  <line x1="0" y1="0" x2="90" y2="50" stroke="rgba(255, 246, 224, 0.2)" strokeWidth="1" />
                  <line x1="0" y1="0" x2="-70" y2="60" stroke="rgba(255, 246, 224, 0.2)" strokeWidth="1" />
                </svg>
              </div>
              
              {/* Surrounding users */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
                <div className="w-10 h-10 rounded-full bg-[#31333A] border-2 border-[#61677A]/40 flex items-center justify-center 
                animate-pulse" style={{animationDuration: '4s'}}>
                  <UserPlus className="h-5 w-5 text-[#D8D9DA]" />
                </div>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4">
                <div className="w-10 h-10 rounded-full bg-[#31333A] border-2 border-[#61677A]/40 flex items-center justify-center
                animate-pulse" style={{animationDuration: '3s'}}>
                  <MessageCircle className="h-5 w-5 text-[#D8D9DA]" />
                </div>
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-x-3/4 -translate-y-1/2">
                <div className="w-10 h-10 rounded-full bg-[#31333A] border-2 border-[#61677A]/40 flex items-center justify-center
                animate-pulse" style={{animationDuration: '5s'}}>
                  <MapPin className="h-5 w-5 text-[#D8D9DA]" />
                </div>
              </div>
              <div className="absolute right-0 top-1/2 transform translate-x-3/4 -translate-y-1/2">
                <div className="w-10 h-10 rounded-full bg-[#31333A] border-2 border-[#61677A]/40 flex items-center justify-center
                animate-pulse" style={{animationDuration: '6s'}}>
                  <Zap className="h-5 w-5 text-[#D8D9DA]" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'mobile':
        return (
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="flex items-center gap-10">
              <div className="relative rounded-xl border-2 border-[#61677A]/40 w-24 h-44 bg-[#272829]/70 overflow-hidden flex flex-col">
                <div className="h-6 bg-[#61677A]/30 w-full flex items-center justify-center">
                  <div className="w-10 h-1 rounded-full bg-[#FFF6E0]/40"></div>
                </div>
                <div className="flex-1 p-2">
                  <div className="w-full h-4 bg-[#FFF6E0]/10 rounded-sm mb-2"></div>
                  <div className="w-3/4 h-4 bg-[#FFF6E0]/10 rounded-sm mb-4"></div>
                  <div className="flex gap-1 mb-3">
                    <div className="w-5 h-5 rounded-full bg-[#FFF6E0]/20"></div>
                    <div className="w-full h-5 bg-[#FFF6E0]/10 rounded-md"></div>
                  </div>
                  <div className="flex gap-1 justify-end">
                    <div className="w-3/4 h-5 bg-[#FFF6E0]/20 rounded-md"></div>
                    <div className="w-5 h-5 rounded-full bg-[#FFF6E0]/20"></div>
                  </div>
                </div>
              </div>
              
              <div className="relative rounded-xl border-2 border-[#61677A]/40 w-48 h-32 bg-[#272829]/70 overflow-hidden">
                <div className="h-6 bg-[#61677A]/30 w-full mb-2">
                  <div className="w-24 h-3 mx-2 mt-1.5 bg-[#FFF6E0]/40 rounded-sm"></div>
                </div>
                <div className="p-3">
                  <div className="w-3/4 h-4 bg-[#FFF6E0]/10 rounded-sm mb-3"></div>
                  <div className="flex gap-1 mb-3">
                    <div className="w-5 h-5 rounded-full bg-[#FFF6E0]/20"></div>
                    <div className="w-full h-5 bg-[#FFF6E0]/10 rounded-md"></div>
                  </div>
                  <div className="flex gap-1 justify-end">
                    <div className="w-3/4 h-5 bg-[#FFF6E0]/20 rounded-md"></div>
                    <div className="w-5 h-5 rounded-full bg-[#FFF6E0]/20"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sync indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className={`w-8 h-8 rounded-full bg-[#31333A]/80 flex items-center justify-center 
              ${interactionProgress > 50 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                <Zap className="h-4 w-4 text-[#FFF6E0]" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Hero section */}
        <div className="text-center max-w-4xl mx-auto mb-16" data-aos="fade-up">
          <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full mb-6">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium">Features</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Connecting</span> People Nearby
          </h1>
          
          <p className="text-xl text-[#D8D9DA] mb-8">
            RadialWhisper brings unique features designed to foster genuine human connections while prioritizing your privacy and control.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {Object.entries(features).map(([key, feature]) => (
              <button
                key={key}
                onClick={() => setActiveFeature(key)}
                className={`px-4 py-2 rounded-full transition-all duration-300 text-sm flex items-center gap-2
                ${activeFeature === key 
                  ? 'bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] font-medium' 
                  : 'bg-[#31333A]/50 text-[#D8D9DA] border border-[#61677A]/30 hover:bg-[#31333A]/80'
                }`}
              >
                <span className={`${activeFeature === key ? 'text-[#272829]' : 'text-[#FFF6E0]'}`}>
                  {feature.icon && <feature.icon.type className="h-4 w-4" />}
                </span>
                <span>{feature.title}</span>
              </button>
            ))}
          </div>
          
          <div className="text-center text-[#D8D9DA]/60 text-sm flex items-center justify-center gap-2 animate-pulse">
            <MousePointer className="h-3 w-3" />
            <span>Click a feature to explore</span>
          </div>
        </div>
        
        {/* Feature showcase */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-gradient-to-br from-[#31333A]/50 to-[#272829]/50 rounded-2xl p-6 md:p-10 border border-[#61677A]/30 shadow-xl backdrop-blur-md relative overflow-hidden" data-aos="fade-up">
            {/* Background glow based on feature */}
            <div className="absolute inset-0 z-0">
              <div className={`absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br ${features[activeFeature].color} blur-[180px] opacity-10 transition-all duration-700`}></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#61677A] blur-[100px] opacity-10"></div>
            </div>
            
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Feature visualization */}
                <div className="flex flex-col">
                  <div className="mb-8">
                    <div className={`inline-flex items-center justify-center rounded-xl h-14 w-14 bg-gradient-to-br ${features[activeFeature].color} shadow-lg mb-4`}>
                      {features[activeFeature].icon
                        
                      }
                    </div>
                    <h2 className="text-3xl font-bold mb-3">{features[activeFeature].title}</h2>
                    <p className="text-[#D8D9DA] text-lg leading-relaxed">
                      {features[activeFeature].description}
                    </p>
                  </div>
                  
                  <div className="flex-1 relative h-64 md:h-80 bg-[#272829]/70 rounded-xl p-6 border border-[#61677A]/20 overflow-hidden shadow-inner">
                    {renderFeatureDemo()}
                  </div>
                </div>
                
                {/* Feature details */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-6 border-b border-[#61677A]/30 pb-2">Key Capabilities</h3>
                    <ul className="space-y-4">
                      {features[activeFeature].details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${features[activeFeature].color} flex items-center justify-center mt-0.5`}>
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-[#D8D9DA]">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-[#61677A]/30">
                    <p className="text-[#D8D9DA]/70 mb-4">
                      Experience the power of {features[activeFeature].title.toLowerCase()} by signing up today.
                    </p>
                    <Link
                      to="/signup"
                      className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${features[activeFeature].color} text-white font-medium transition-all hover:shadow-lg hover:opacity-90`}
                    >
                      Try It Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Premium Features Section */}
        <div className="max-w-5xl mx-auto mb-20" data-aos="fade-up">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center rounded-full h-12 w-12 bg-gradient-to-r from-amber-400 to-yellow-600 mb-4">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Premium Features</h2>
            <p className="text-[#D8D9DA] text-lg max-w-3xl mx-auto">
              Enhance your RadialWhisper experience with our premium features designed for power users.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Premium Feature Cards */}
            <div className="bg-gradient-to-br from-[#31333A]/70 to-[#272829]/70 rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="100">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-lg">
                    <Radio className="h-6 w-6 text-white" />
                  </div>
                  <span className="bg-[#FFF6E0]/10 px-2 py-1 rounded text-xs font-medium">Premium</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Extended Radius</h3>
                <p className="text-[#D8D9DA] mb-8">Increase your discovery radius up to 5km to connect with more people in your broader area.</p>
                <div className="flex items-center text-[#FFF6E0]/70 text-sm">
                  <Check className="h-4 w-4 mr-2" />
                  <span>Up to 5x larger discovery range</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#31333A]/70 to-[#272829]/70 rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="200">
              <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-lg">
                    <BellRing className="h-6 w-6 text-white" />
                  </div>
                  <span className="bg-[#FFF6E0]/10 px-2 py-1 rounded text-xs font-medium">Premium</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Priority Notifications</h3>
                <p className="text-[#D8D9DA] mb-8">Receive instant notifications when someone with matching interests enters your radius.</p>
                <div className="flex items-center text-[#FFF6E0]/70 text-sm">
                  <Check className="h-4 w-4 mr-2" />
                  <span>Interest-based alerts</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#31333A]/70 to-[#272829]/70 rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="300">
              <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <span className="bg-[#FFF6E0]/10 px-2 py-1 rounded text-xs font-medium">Premium</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Interest Groups</h3>
                <p className="text-[#D8D9DA] mb-8">Create and join interest-based groups in your area to connect with like-minded people.</p>
                <div className="flex items-center text-[#FFF6E0]/70 text-sm">
                  <Check className="h-4 w-4 mr-2" />
                  <span>Unlimited group creation</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/premium" className="group relative overflow-hidden btn bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 inline-flex items-center shadow-lg">
              <span>Upgrade to Premium</span>
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="max-w-5xl mx-auto" data-aos="fade-up">
          <div className="bg-gradient-to-br from-[#31333A] to-[#272829] p-10 rounded-2xl border border-[#61677A]/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#61677A] blur-[100px] opacity-20"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#FFF6E0] blur-[100px] opacity-5"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience RadialWhisper?</h2>
              <p className="text-[#D8D9DA] leading-relaxed mb-8 max-w-2xl mx-auto">
                Join our community today and discover new connections in your vicinity with our innovative proximity-based platform.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/signup" 
                  className="group relative overflow-hidden btn bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </Link>
                
                <Link 
                  to="/about" 
                  className="btn btn-outline text-[#FFF6E0] border-[#FFF6E0] hover:bg-[#FFF6E0] hover:text-[#272829] hover:border-[#FFF6E0] px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-md"
                >
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

export default LandingFeatures;
