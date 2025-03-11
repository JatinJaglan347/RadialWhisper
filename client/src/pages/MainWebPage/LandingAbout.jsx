// pages/About.jsx
import React from 'react';

const LandingAbout = () => {
  return (
    <div className="bg-[#272829] text-[#FFF6E0]">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About RadialWhisper</h1>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-[#D8D9DA]">
                RadialWhisper was created with a simple mission: to help people connect with others in their immediate surroundings.
                In an increasingly digital world, we believe there's still incredible value in connecting with people who
                share your physical space. Whether you're at a coffee shop, concert, campus, or conference, RadialWhisper helps
                you break the ice and start conversations with people nearby.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-[#D8D9DA]">
                RadialWhisper began as a simple idea: what if we could chat with people around us without the awkwardness
                of introducing ourselves? Our founders, a group of university students, found themselves in the same
                lecture hall day after day, surrounded by peers they never spoke to. They created RadialWhisper as a
                solution to this common social barrier.
              </p>
              <p className="text-[#D8D9DA] mt-4">
                Since our launch in 2023, we've grown from a small campus app to a platform used by thousands of
                people across the country to make meaningful connections with those in their vicinity.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Privacy & Safety</h2>
              <p className="text-[#D8D9DA]">
                At RadialWhisper, we believe that privacy is paramount. Our platform is designed to give users control
                over what information they share. We never reveal personal details like names or contact information.
                Users can only see profile pictures, gender, and bios of others within their radius.
              </p>
              <p className="text-[#D8D9DA] mt-4">
                We've implemented robust safety features and community guidelines to ensure that RadialWhisper
                remains a positive space for all users. Our moderation team works around the clock to
                address any reports and maintain the integrity of our platform.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Looking Forward</h2>
              <p className="text-[#D8D9DA]">
                As we continue to grow, we remain committed to our core values of privacy, safety, and
                fostering genuine connections. We're constantly working on new features to enhance the
                user experience while staying true to our mission of connecting people in proximity.
              </p>
              <p className="text-[#D8D9DA] mt-4">
                Join us on this journey as we redefine how people connect in the digital age.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingAbout;