import React from 'react';
import { Radio, Users, Shield, ChevronRight } from 'lucide-react';

const LandingAbout = () => {
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
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full mb-6">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium">About Us</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">RadialWhisper</span>
          </h1>
          
          <div className="space-y-12">
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4">
                  <Radio className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                RadialWhisper was created with a simple mission: to help people connect with others in their immediate surroundings.
                In an increasingly digital world, we believe there's still incredible value in connecting with people who
                share your physical space. Whether you're at a coffee shop, concert, campus, or conference, RadialWhisper helps
                you break the ice and start conversations with people nearby.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">Our Story</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                RadialWhisper began as a simple idea: what if we could chat with people around us without the awkwardness
                of introducing ourselves? Our founders, a group of university students, found themselves in the same
                lecture hall day after day, surrounded by peers they never spoke to. They created RadialWhisper as a
                solution to this common social barrier.
              </p>
              <p className="text-[#D8D9DA] mt-4 leading-relaxed">
                Since our launch in 2023, we've grown from a small campus app to a platform used by thousands of
                people across the country to make meaningful connections with those in their vicinity.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4">
                  <Shield className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">Privacy & Safety</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                At RadialWhisper, we believe that privacy is paramount. Our platform is designed to give users control
                over what information they share. We never reveal personal details like names or contact information.
                Users can only see profile pictures, gender, and bios of others within their radius.
              </p>
              <p className="text-[#D8D9DA] mt-4 leading-relaxed">
                We've implemented robust safety features and community guidelines to ensure that RadialWhisper
                remains a positive space for all users. Our moderation team works around the clock to
                address any reports and maintain the integrity of our platform.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4">
                  <ChevronRight className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">Looking Forward</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                As we continue to grow, we remain committed to our core values of privacy, safety, and
                fostering genuine connections. We're constantly working on new features to enhance the
                user experience while staying true to our mission of connecting people in proximity.
              </p>
              <p className="text-[#D8D9DA] mt-4 leading-relaxed">
                Join us on this journey as we redefine how people connect in the digital age.
              </p>
            </div>
          </div>
          
          {/* Visual element similar to 404 page */}
          <div className="relative mx-auto w-32 h-32 mt-16">
            <div className="absolute inset-0 bg-gradient-to-r from-[#61677A]/30 to-[#D8D9DA]/30 rounded-full opacity-60 blur-xl"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="absolute w-full h-full rounded-full border-4 border-[#61677A]/40 animate-ping" style={{animationDuration: '3s'}}></div>
              <div className="absolute w-3/4 h-3/4 rounded-full border-4 border-[#FFF6E0]/30"></div>
              <div className="absolute w-1/2 h-1/2 rounded-full border-4 border-[#FFF6E0]/20"></div>
              <Radio size={30} className="text-[#FFF6E0] animate-pulse" style={{animationDuration: '2s'}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingAbout;