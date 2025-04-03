import React from 'react';
import { Lock, Shield, Database, UserX, Clock, Eye, BellRing, Map } from 'lucide-react';

const LandingPrivacy = () => {
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
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium">Legal</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Privacy Policy</span>
          </h1>
          
          <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm mb-8">
            <p className="text-[#D8D9DA] leading-relaxed">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-[#D8D9DA] leading-relaxed mt-4">
              This Privacy Policy describes how RadialWhisper ("we," "us," or "our") collects, uses, and shares 
              your personal information when you use our application and services. Please read this Privacy Policy 
              carefully. By using RadialWhisper, you agree to the practices described in this policy.
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Database className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">1. Information We Collect</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                When you use RadialWhisper, we collect the following types of information:
              </p>
              
              <div className="mt-4 space-y-4">
                <div className="bg-[#31333A]/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">1.1. Personal Information</h3>
                  <ul className="text-[#D8D9DA] leading-relaxed list-disc pl-10 space-y-2">
                    <li>Full Name</li>
                    <li>Email Address</li>
                    <li>Password (stored in encrypted format)</li>
                    <li>Gender</li>
                    <li>Date of Birth</li>
                    <li>Bio Information (selected traits and interests)</li>
                  </ul>
                </div>
                
                <div className="bg-[#31333A]/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">1.2. Location Data</h3>
                  <ul className="text-[#D8D9DA] leading-relaxed list-disc pl-10 space-y-2">
                    <li>Current Geographic Coordinates</li>
                    <li>Location Radius Preference</li>
                  </ul>
                  <p className="text-[#D8D9DA] mt-2">
                    Location data is essential for the core functionality of RadialWhisper, as it enables you 
                    to connect with users in your vicinity.
                  </p>
                </div>
                
                <div className="bg-[#31333A]/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">1.3. Automatically Generated Information</h3>
                  <ul className="text-[#D8D9DA] leading-relaxed list-disc pl-10 space-y-2">
                    <li>Unique Tag (automatically generated identifier)</li>
                    <li>Profile Image (generated via Dicebear API)</li>
                    <li>IP Address</li>
                    <li>Device Information (browser/device type, operating system)</li>
                    <li>Session Information</li>
                  </ul>
                </div>
                
                <div className="bg-[#31333A]/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">1.4. Usage Information</h3>
                  <ul className="text-[#D8D9DA] leading-relaxed list-disc pl-10 space-y-2">
                    <li>User Interactions (messages, friend requests, connections)</li>
                    <li>Active Status and Last Active Timestamp</li>
                    <li>App Usage Patterns</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Eye className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="text-[#D8D9DA] leading-relaxed list-disc pl-10 mt-4 space-y-2">
                <li>Provide, maintain, and improve RadialWhisper services</li>
                <li>Connect you with other users based on geographic proximity</li>
                <li>Generate your unique tag and profile image</li>
                <li>Authenticate your identity and secure your account</li>
                <li>Enable communication between users</li>
                <li>Send you important notifications about your account or the service</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                <li>Detect, investigate, and prevent fraudulent transactions and unauthorized access to our services</li>
                <li>Enforce our Terms and Conditions and other usage policies</li>
              </ul>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Clock className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">3. Data Retention</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                We retain different types of data for varying periods:
              </p>
              
              <div className="mt-4 space-y-4">
                <div className="bg-[#31333A]/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">3.1. Account Information</h3>
                  <p className="text-[#D8D9DA]">
                    We retain your account information for as long as your account is active. If you delete your account, 
                    we will delete or anonymize your personal information within a reasonable timeframe, except for 
                    information that we are required to maintain for legal purposes.
                  </p>
                </div>
                
                <div className="bg-[#31333A]/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">3.2. Location Data</h3>
                  <p className="text-[#D8D9DA]">
                    Your current location coordinates are retained until updated. We keep a record of your location 
                    preferences (radius settings) as part of your account settings.
                  </p>
                </div>
                
                <div className="bg-[#31333A]/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">3.3. Message Data</h3>
                  <p className="text-[#D8D9DA]">
                    For privacy and performance reasons, RadialWhisper implements an automatic message deletion schedule:
                  </p>
                  <ul className="text-[#D8D9DA] leading-relaxed list-disc pl-10 mt-2 space-y-2">
                    <li>Friend Messages: Deleted after 48 hours</li>
                    <li>Nearby User Messages: Deleted after 1 hour</li>
                    <li>Unread Messages: Preserved for up to 60 hours</li>
                  </ul>
                </div>
                
                <div className="bg-[#31333A]/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">3.4. Technical Data</h3>
                  <p className="text-[#D8D9DA]">
                    Technical information such as IP addresses and session data may be retained for security purposes and system optimization. This information is typically kept for up to 90 days, after which it is anonymized or deleted.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Shield className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">4. Information Sharing and Disclosure</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                RadialWhisper is designed with privacy as a priority. We do not sell your personal information. 
                We may share your information only in the following limited circumstances:
              </p>
              
              <div className="mt-4 space-y-4">
                <div className="bg-[#31333A]/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">4.1. With Other Users</h3>
                  <p className="text-[#D8D9DA]">
                    By design, RadialWhisper shares limited information with other users of the app:
                  </p>
                  <ul className="text-[#D8D9DA] leading-relaxed list-disc pl-10 mt-2 space-y-2">
                    <li><strong>For Nearby Users:</strong> Your bio information, gender, unique tag, and auto-generated profile image are visible to users within your geographic radius</li>
                    <li><strong>For Friends:</strong> After establishing a friendship connection, your full name and other profile details become visible</li>
                  </ul>
                </div>
                
                <div className="bg-[#31333A]/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">4.2. For Legal Reasons</h3>
                  <p className="text-[#D8D9DA]">
                    We may share information if we believe in good faith that disclosure is necessary to:
                  </p>
                  <ul className="text-[#D8D9DA] leading-relaxed list-disc pl-10 mt-2 space-y-2">
                    <li>Comply with applicable laws, regulations, legal processes, or government requests</li>
                    <li>Enforce our policies, including investigation of potential violations</li>
                    <li>Detect, prevent, or address fraud, security, or technical issues</li>
                    <li>Protect against harm to the rights, property, or safety of RadialWhisper, our users, or the public</li>
                  </ul>
                </div>
                
                <div className="bg-[#31333A]/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">4.3. With Third-Party Service Providers</h3>
                  <p className="text-[#D8D9DA]">
                    We do not share user data with third parties for their own purposes. We may engage trusted service providers 
                    who assist us in delivering our services, but these providers are contractually bound to use the information 
                    only for the purposes of providing services to us.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Map className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">5. Location Privacy</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                Given that location data is central to RadialWhisper's functionality, we take special care with this information:
              </p>
              <ul className="text-[#D8D9DA] leading-relaxed list-disc pl-10 mt-4 space-y-2">
                <li>While we collect precise location coordinates to enable proximity-based features, we never share your exact coordinates with other users</li>
                <li>We use your location data only to determine which users are within your chosen radius</li>
                <li>You can adjust your location radius preference at any time through the app settings</li>
                <li>You may temporarily disable location sharing, although this will limit your ability to discover nearby users</li>
              </ul>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Lock className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">6. Data Security</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. Our security measures include:
              </p>
              <ul className="text-[#D8D9DA] leading-relaxed list-disc pl-10 mt-4 space-y-2">
                <li>Password encryption</li>
                <li>Secure communication protocols (HTTPS)</li>
                <li>Regular security audits</li>
                <li>Access controls for our systems and data</li>
                <li>Token-based authentication system</li>
              </ul>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                While we strive to protect your personal information, no method of transmission over the Internet or 
                electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <UserX className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">7. Age Restrictions</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                RadialWhisper is intended for use by individuals who meet the minimum age requirement as specified 
                within the app at the time of registration. This minimum age requirement is set by application 
                administrators and may vary based on local regulations.
              </p>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                We do not knowingly collect personal information from individuals who do not meet the applicable age 
                requirement. If we discover that we have collected personal information from an underage individual, 
                we will delete that information as quickly as possible.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <BellRing className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">8. Your Rights and Choices</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                Depending on your location, you may have certain rights regarding your personal information. These rights may include:
              </p>
              <ul className="text-[#D8D9DA] leading-relaxed list-disc pl-10 mt-4 space-y-2">
                <li><strong>Access:</strong> You can request information about the personal data we hold about you</li>
                <li><strong>Correction:</strong> You can request that we correct inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> You can request that we delete your personal information</li>
                <li><strong>Restriction:</strong> You can request that we restrict the processing of your data</li>
                <li><strong>Data Portability:</strong> You can request a copy of your data in a structured, machine-readable format</li>
                <li><strong>Objection:</strong> You can object to our processing of your personal information</li>
              </ul>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                To exercise these rights, please contact us through the app's settings or via our contact form. 
                We will respond to your request within a reasonable timeframe.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Shield className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">9. Policy Changes</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                We may update this Privacy Policy from time to time. If we make significant changes, we will notify you through 
                the app or by other means. Your continued use of RadialWhisper after such changes constitutes your acceptance 
                of the new Privacy Policy.
              </p>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                We encourage you to review our Privacy Policy periodically to stay informed about our data practices.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Lock className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">10. Contact Us</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                please contact us through the app's contact form or via email.
              </p>
            </div>
          </div>
          
          {/* Final note */}
          <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm mt-8">
            <p className="text-[#D8D9DA] leading-relaxed">
              By using RadialWhisper, you acknowledge that you have read and understood this Privacy Policy and agree 
              to our collection, use, and disclosure practices as described herein.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPrivacy; 