import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Check,
  BellRing,
  Crown
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';


function PremiumPlan() {
  const [seed, setSeed] = useState();
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  useEffect(() => {
    setSeed(Math.random() * 100);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      startEvent: 'DOMContentLoaded',
      offset: 100
    });
    window.scrollTo(0, 0);
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

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="bg-[#272829] text-[#FFF6E0] overflow-hidden">

        {/* Warning Banner */}
<div className="bg-yellow-500/90 text-[#272829] p-4 text-center font-medium">
  <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
    <BellRing className="md:h-5 md:w-5 sm:h-10 sm:w-10 h-15 w-15 " />
    <p>RadialWhisper Premium is currently under development. Some premium features are temporarily available to all users during this testing phase.</p>
  </div>
</div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Dynamic background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#272829] opacity-80"></div>
          {/* Background with subtle blur for hero section */}
          <div className="absolute inset-0 bg-[url('/src/assets/images/city-background.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#272829] via-[#31333A] to-transparent opacity-90"></div>
        </div>

        {/* Animated floating orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-30 animate-pulse" style={{ animationDuration: '7s' }}></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-20 animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-40 left-1/4 w-40 h-40 rounded-full bg-[#FFF6E0] blur-[80px] opacity-10 animate-pulse" style={{ animationDuration: '8s' }}></div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 mb-20">
          <div className="text-center" data-aos="fade-up">
            <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full mb-6">
              <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium">Premium Plans</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Elevate Your <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Connection</span> Experience
            </h1>

            <p className="text-xl mb-8 text-[#D8D9DA] max-w-2xl mx-auto leading-relaxed">
              Unlock premium features that enhance your proximity chat experience with RadialWhisper Premium.
              Choose the plan that fits your connection needs.
            </p>

            {/* Animated crown icon */}
            <div className="flex justify-center mb-12" data-aos="zoom-in" data-aos-delay="300">
              <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] p-6 rounded-full shadow-lg animate-pulse" style={{ animationDuration: '3s' }}>
                <Crown size={48} className="text-[#272829]" />
              </div>
            </div>

            {/* Toggle between monthly and yearly */}
            <div className="flex justify-center mb-16" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-[#31333A] p-1 rounded-full inline-flex">
                <button 
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedPlan === 'monthly' ? 'bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829]' : 'text-[#D8D9DA]'}`}
                  onClick={() => handlePlanChange('monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedPlan === 'yearly' ? 'bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829]' : 'text-[#D8D9DA]'}`}
                  onClick={() => handlePlanChange('yearly')}
                >
                  Yearly <span className="text-xs">Save 20%</span>
                </button>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-gradient-to-b from-[#31333A] to-[#272829] rounded-2xl overflow-hidden border border-[#61677A]/30 shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-10px] hover:border-[#61677A]/60" data-aos="fade-up" data-aos-delay="100">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-[#D8D9DA] mb-6">Basic features for casual users</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-[#D8D9DA]">/forever</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FFF6E0] mt-0.5" />
                    <span className="text-[#D8D9DA]">Radius up to 500m</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FFF6E0] mt-0.5" />
                    <span className="text-[#D8D9DA]">Basic profile customization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FFF6E0] mt-0.5" />
                    <span className="text-[#D8D9DA]">Chat with up to 5 people simultaneously</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FFF6E0] mt-0.5" />
                    <span className="text-[#D8D9DA]">Standard support</span>
                  </li>
                </ul>
                <Link to="#" className="block w-full btn bg-[#61677A]/50 hover:bg-[#61677A]/70 text-[#FFF6E0] border-none px-6 py-3 rounded-full font-medium transition-all duration-300 text-center">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-b from-[#31333A] to-[#272829] rounded-2xl overflow-hidden border border-[#FFF6E0]/30 shadow-xl transform scale-105 relative z-20 transition-all duration-500 hover:shadow-2xl hover:translate-y-[-10px] hover:border-[#FFF6E0]/60" data-aos="fade-up">
              {/* Most popular badge */}
              <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] text-sm font-medium py-1 text-center">
                MOST POPULAR
              </div>
              <div className="p-8 pt-12">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <p className="text-[#D8D9DA] mb-6">Enhanced features for active users</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold">${selectedPlan === 'monthly' ? '4.99' : '3.99'}</span>
                  <span className="text-[#D8D9DA]">/{selectedPlan === 'monthly' ? 'month' : 'month, billed yearly'}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FFF6E0] mt-0.5" />
                    <span className="text-[#D8D9DA]">Extended radius up to 2km</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FFF6E0] mt-0.5" />
                    <span className="text-[#D8D9DA]">Advanced profile customization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FFF6E0] mt-0.5" />
                    <span className="text-[#D8D9DA]">Unlimited simultaneous chats</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FFF6E0] mt-0.5" />
                    <span className="text-[#D8D9DA]">Ad-free experience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FFF6E0] mt-0.5" />
                    <span className="text-[#D8D9DA]">Priority support</span>
                  </li>
                </ul>
                <Link to="#" className="group relative overflow-hidden block w-full btn bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-6 py-3 rounded-full font-medium transition-all duration-300 text-center">
                  <span className="relative z-10">Get Premium</span>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-[#31333A] to-[#272829] rounded-2xl overflow-hidden border border-[#61677A]/30 shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-10px] hover:border-[#61677A]/60" data-aos="fade-up" data-aos-delay="200">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">Ultimate</h3>
                <p className="text-[#D8D9DA] mb-6">Premium features for power users</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold">${selectedPlan === 'monthly' ? '9.99' : '7.99'}</span>
                  <span className="text-[#D8D9DA]">/{selectedPlan === 'monthly' ? 'month' : 'month, billed yearly'}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FFF6E0] mt-0.5" />
                    <span className="text-[#D8D9DA]">Maximum radius up to 5km</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FFF6E0] mt-0.5" />
                    <span className="text-[#D8D9DA]">Full profile customization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FFF6E0] mt-0.5" />
                    <span className="text-[#D8D9DA]">Create and join interest-based groups</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FFF6E0] mt-0.5" />
                    <span className="text-[#D8D9DA]">Incognito mode</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FFF6E0] mt-0.5" />
                    <span className="text-[#D8D9DA]">Premium profile badge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FFF6E0] mt-0.5" />
                    <span className="text-[#D8D9DA]">24/7 VIP support</span>
                  </li>
                </ul>
                <Link to="#" className="block w-full btn bg-[#61677A]/50 hover:bg-[#61677A]/70 text-[#FFF6E0] border-none px-6 py-3 rounded-full font-medium transition-all duration-300 text-center">
                  Get Ultimate
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Curved wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-32">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,96,0,64V56.44Z" fill="#61677A"></path>
          </svg>
        </div>
      </div>

      {/* Feature Comparison */}
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
            <span className="bg-[#272829]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">Compare Plans</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Find Your Perfect Plan</h2>
            <p className="text-lg max-w-3xl mx-auto text-[#FFF6E0]/90">Compare all features to find the plan that fits your needs</p>
          </div>

          {/* Feature comparison table */}
          <div className="overflow-x-auto" data-aos="fade-up" data-aos-delay="100">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left bg-[#272829]/20 rounded-tl-lg">Features</th>
                  <th className="p-4 text-center bg-[#272829]/20">Free</th>
                  <th className="p-4 text-center bg-[#272829]/20 border-x border-[#FFF6E0]/10">Premium</th>
                  <th className="p-4 text-center bg-[#272829]/20 rounded-tr-lg">Ultimate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#FFF6E0]/10">
                  <td className="p-4 bg-[#272829]/10">Chat Radius</td>
                  <td className="p-4 text-center bg-[#272829]/10">Up to 500m</td>
                  <td className="p-4 text-center bg-[#272829]/10 border-x border-[#FFF6E0]/10">Up to 2km</td>
                  <td className="p-4 text-center bg-[#272829]/10">Up to 5km</td>
                </tr>
                <tr className="border-b border-[#FFF6E0]/10">
                  <td className="p-4 bg-[#272829]/10">Profile Customization</td>
                  <td className="p-4 text-center bg-[#272829]/10">Basic</td>
                  <td className="p-4 text-center bg-[#272829]/10 border-x border-[#FFF6E0]/10">Advanced</td>
                  <td className="p-4 text-center bg-[#272829]/10">Full</td>
                </tr>
                <tr className="border-b border-[#FFF6E0]/10">
                  <td className="p-4 bg-[#272829]/10">Simultaneous Chats</td>
                  <td className="p-4 text-center bg-[#272829]/10">5 max</td>
                  <td className="p-4 text-center bg-[#272829]/10 border-x border-[#FFF6E0]/10">Unlimited</td>
                  <td className="p-4 text-center bg-[#272829]/10">Unlimited</td>
                </tr>
                <tr className="border-b border-[#FFF6E0]/10">
                  <td className="p-4 bg-[#272829]/10">Ad-Free Experience</td>
                  <td className="p-4 text-center bg-[#272829]/10">
                    <span className="inline-block w-5 h-5 text-[#D8D9DA]">—</span>
                  </td>
                  <td className="p-4 text-center bg-[#272829]/10 border-x border-[#FFF6E0]/10">
                    <Check className="inline-block w-5 h-5 text-[#FFF6E0]" />
                  </td>
                  <td className="p-4 text-center bg-[#272829]/10">
                    <Check className="inline-block w-5 h-5 text-[#FFF6E0]" />
                  </td>
                </tr>
                <tr className="border-b border-[#FFF6E0]/10">
                  <td className="p-4 bg-[#272829]/10">Interest-Based Groups</td>
                  <td className="p-4 text-center bg-[#272829]/10">
                    <span className="inline-block w-5 h-5 text-[#D8D9DA]">—</span>
                  </td>
                  <td className="p-4 text-center bg-[#272829]/10 border-x border-[#FFF6E0]/10">
                    <span className="inline-block w-5 h-5 text-[#D8D9DA]">—</span>
                  </td>
                  <td className="p-4 text-center bg-[#272829]/10">
                    <Check className="inline-block w-5 h-5 text-[#FFF6E0]" />
                  </td>
                </tr>
                <tr className="border-b border-[#FFF6E0]/10">
                  <td className="p-4 bg-[#272829]/10">Incognito Mode</td>
                  <td className="p-4 text-center bg-[#272829]/10">
                    <span className="inline-block w-5 h-5 text-[#D8D9DA]">—</span>
                  </td>
                  <td className="p-4 text-center bg-[#272829]/10 border-x border-[#FFF6E0]/10">
                    <span className="inline-block w-5 h-5 text-[#D8D9DA]">—</span>
                  </td>
                  <td className="p-4 text-center bg-[#272829]/10">
                    <Check className="inline-block w-5 h-5 text-[#FFF6E0]" />
                  </td>
                </tr>
                <tr className="border-b border-[#FFF6E0]/10">
                  <td className="p-4 bg-[#272829]/10">Message Themes</td>
                  <td className="p-4 text-center bg-[#272829]/10">1</td>
                  <td className="p-4 text-center bg-[#272829]/10 border-x border-[#FFF6E0]/10">5</td>
                  <td className="p-4 text-center bg-[#272829]/10">10+</td>
                </tr>
                <tr>
                  <td className="p-4 bg-[#272829]/10 rounded-bl-lg">Customer Support</td>
                  <td className="p-4 text-center bg-[#272829]/10">Standard</td>
                  <td className="p-4 text-center bg-[#272829]/10 border-x border-[#FFF6E0]/10">Priority</td>
                  <td className="p-4 text-center bg-[#272829]/10 rounded-br-lg">24/7 VIP</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagonal divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden transform scale-y-[-1]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-32">
            <path d="M1200 120L0 16.48V0h1200v120z" fill="#272829"></path>
          </svg>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 md:py-36 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-40 left-0 w-96 h-96 rounded-full bg-[#61677A] blur-[150px] opacity-20 parallax" data-speed="0.3"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-10 parallax" data-speed="0.2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20" data-aos="fade-up">
            <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Premium Users Say</h2>
            <p className="text-lg max-w-3xl mx-auto text-[#D8D9DA]">Hear from people who have elevated their connection experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl shadow-xl relative" data-aos="fade-up" data-aos-delay="100">
              {/* Quote mark */}
              <div className="absolute top-6 right-6 text-6xl text-[#61677A]/20 font-serif">"</div>
              
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#61677A] flex-shrink-0 overflow-hidden mr-4">
                  <img src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed + 10}`} alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Alex M.</h4>
                  <p className="text-sm text-[#D8D9DA]">Premium User</p>
                </div>
              </div>
              
              <p className="text-[#D8D9DA] mb-4 relative z-10">
                "The extended radius has been a game-changer for me. I've met so many interesting people at concerts and events that I would have missed with the basic plan."
              </p>
              
              <div className="flex items-center">
                <Star className="w-4 h-4 text-[#FFF6E0]" fill="#FFF6E0" />
                <Star className="w-4 h-4 text-[#FFF6E0]" fill="#FFF6E0" />
                <Star className="w-4 h-4 text-[#FFF6E0]" fill="#FFF6E0" />
                <Star className="w-4 h-4 text-[#FFF6E0]" fill="#FFF6E0" />
                <Star className="w-4 h-4 text-[#FFF6E0]" fill="#FFF6E0" />
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl shadow-xl relative" data-aos="fade-up" data-aos-delay="200">
              {/* Quote mark */}
              <div className="absolute top-6 right-6 text-6xl text-[#61677A]/20 font-serif">"</div>
              
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#61677A] flex-shrink-0 overflow-hidden mr-4">
                  <img src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed + 20}`} alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Jamie T.</h4>
                  <p className="text-sm text-[#D8D9DA]">Ultimate User</p>
                </div>
              </div>
              
              <p className="text-[#D8D9DA] mb-4 relative z-10">
                "Being able to create interest-based groups has completely transformed how I use the app. I've found my community of fellow photographers in my area!"
              </p>
              
              <div className="flex items-center">
                <Star className="w-4 h-4 text-[#FFF6E0]" fill="#FFF6E0" />
                <Star className="w-4 h-4 text-[#FFF6E0]" fill="#FFF6E0" />
                <Star className="w-4 h-4 text-[#FFF6E0]" fill="#FFF6E0" />
                <Star className="w-4 h-4 text-[#FFF6E0]" fill="#FFF6E0" />
                <Star className="w-4 h-4 text-[#FFF6E0]" fill="#FFF6E0" />
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl shadow-xl relative" data-aos="fade-up" data-aos-delay="300">
              {/* Quote mark */}
              <div className="absolute top-6 right-6 text-6xl text-[#61677A]/20 font-serif">"</div>
              
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#61677A] flex-shrink-0 overflow-hidden mr-4">
                  <img src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed + 30}`} alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Taylor R.</h4>
                  <p className="text-sm text-[#D8D9DA]">Premium User</p>
                </div>
              </div>
              
              <p className="text-[#D8D9DA] mb-4 relative z-10">
                "As someone who values privacy, I upgraded to Premium for the ad-free experience. Worth every penny just for that, but the other features are great too!"
              </p>
              
              <div className="flex items-center">
                <Star className="w-4 h-4 text-[#FFF6E0]" fill="#FFF6E0" />
                <Star className="w-4 h-4 text-[#FFF6E0]" fill="#FFF6E0" />
                <Star className="w-4 h-4 text-[#FFF6E0]" fill="#FFF6E0" />
                <Star className="w-4 h-4 text-[#FFF6E0]" fill="#FFF6E0" />
                <Star className="w-4 h-4 text-[#FFF6E0]" fill="#FFF6E0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#31333A] py-24 md:py-32 relative">
        {/* Curved divider at top */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform rotate-180">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-32">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,96,0,64V56.44Z" fill="#272829"></path>
          </svg>
        </div>

        {/* Background blob */}
        <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 w-96 h-96 rounded-full bg-[#FFF6E0] blur-[150px] opacity-5"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="bg-[#272829]/50 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-[#D8D9DA]">Answers to common questions about our premium plans</p>
          </div>

          <div className="space-y-6" data-aos="fade-up" data-aos-delay="100">
            {/* FAQ Item 1 */}
            <div className="bg-[#272829]/50 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-3">How do I upgrade to Premium or Ultimate?</h3>
              <p className="text-[#D8D9DA]">You can upgrade through the app by going to your profile settings and selecting "Manage Subscription." From there, you can choose your preferred plan and payment method.</p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-[#272829]/50 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-3">Can I change my plan later?</h3>
              <p className="text-[#D8D9DA]">Yes, you can easily upgrade, downgrade, or cancel your subscription at any time through your account settings. Changes to your subscription will take effect at the end of your current billing cycle.</p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-[#272829]/50 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-3">What payment methods do you accept?</h3>
              <p className="text-[#D8D9DA]">We accept all major credit cards, PayPal, Apple Pay, and Google Pay. All payments are securely processed and your payment information is never stored on our servers.</p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-[#272829]/50 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-3">Is there a free trial for premium plans?</h3>
              <p className="text-[#D8D9DA]">Yes, we offer a 7-day free trial for new Premium subscribers so you can experience all the benefits before committing. You won't be charged until the trial period ends, and you can cancel anytime.</p>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-[#272829]/50 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-3">What is Incognito Mode in the Ultimate plan?</h3>
              <p className="text-[#D8D9DA]">Incognito Mode allows you to browse and chat without appearing in other users' lists unless you initiate contact. It's perfect for those who want more control over their visibility while still being able to connect with others.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 md:py-28 relative overflow-hidden">
        {/* Dynamic background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#272829] opacity-80"></div>
          {/* Background with subtle blur */}
          <div className="absolute inset-0 bg-[url('/src/assets/images/city-background.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#272829] via-[#272829] to-[#31333A] opacity-90"></div>
        </div>

        {/* Animated orbs */}
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#61677A] blur-[120px] opacity-20 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#FFF6E0] blur-[100px] opacity-5 animate-pulse" style={{ animationDuration: '12s' }}></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-[#31333A] to-[#272829] p-10 md:p-16 rounded-3xl border border-[#61677A]/30 shadow-2xl" data-aos="fade-up">
            <div className="md:flex items-center justify-between">
              <div className="md:w-2/3 mb-10 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Elevate Your Connection Experience?</h2>
                <p className="text-[#D8D9DA] mb-6">Join thousands of users who've enhanced their RadialWhisper experience with our premium plans.</p>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-[#FFF6E0]" />
                  <span>7-day free trial available</span>
                </div>
                <div className="flex items-center space-x-3 mt-3">
                  <Check className="h-5 w-5 text-[#FFF6E0]" />
                  <span>Cancel anytime, no commitment</span>
                </div>
              </div>
              <div className="md:w-1/3 text-center">
                <Link to="#" className="inline-block w-full btn bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-6 py-4 rounded-full font-medium transition-all duration-300 text-lg">
                  Get Started Now
                </Link>
                <p className="text-sm text-[#D8D9DA] mt-3">No credit card required for trial</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PremiumPlan;