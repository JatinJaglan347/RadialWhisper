import React from 'react';
import { Scale, AlertTriangle, Check, Shield, BookOpen } from 'lucide-react';

const LandingTerms = () => {
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
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Terms & Conditions</span>
          </h1>
          
          <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm mb-8">
            <p className="text-[#D8D9DA] leading-relaxed">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-[#D8D9DA] leading-relaxed mt-4">
              Please read these Terms and Conditions ("Terms") carefully before using the RadialWhisper application
              operated by RadialWhisper ("we," "us," or "our"). By accessing or using our Service, you agree to be bound
              by these Terms. If you disagree with any part of these terms, you may not access the Service.
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                By creating an account on RadialWhisper, you accept and agree to be bound by these Terms, 
                our Privacy Policy, and any additional terms and conditions that may apply. 
                We reserve the right to modify these Terms at any time, and such modifications shall be effective 
                immediately upon posting the modified Terms on the RadialWhisper app or website. You agree to 
                review the Terms periodically to be aware of such modifications and your continued use of 
                RadialWhisper shall be deemed your conclusive acceptance of the modified Terms.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">2. Age Requirements</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                RadialWhisper is intended for use by individuals who meet the minimum age requirement as specified 
                within the app at the time of registration. This minimum age requirement is adjustable by RadialWhisper 
                administrators and may vary based on local regulations. By using RadialWhisper, you represent and warrant 
                that you meet the applicable age requirement. If we discover or believe that you do not meet the age 
                requirement, we reserve the right to suspend or terminate your account immediately.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Check className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">3. User Accounts</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                3.1. To use RadialWhisper, you must register and create an account. You agree to provide accurate, 
                current, and complete information during the registration process and to update such information 
                to keep it accurate, current, and complete.
              </p>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                3.2. You are responsible for safeguarding the password and access to your RadialWhisper account. You 
                agree not to disclose your password to any third party and to take sole responsibility for any activities 
                or actions under your account, whether or not you have authorized such activities or actions.
              </p>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                3.3. You must notify us immediately upon becoming aware of any security breach or unauthorized use of your account.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Scale className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">4. User Conduct</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                4.1. You agree to use RadialWhisper solely for lawful and legitimate purposes. You shall not use 
                RadialWhisper for any illegal or unauthorized purpose.
              </p>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                4.2. When using RadialWhisper, you agree not to:
              </p>
              <ul className="text-[#D8D9DA] leading-relaxed list-disc pl-10 mt-2 space-y-2">
                <li>Post or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
                <li>Harass, intimidate, or harm other users</li>
                <li>Upload or transmit any material that infringes any patent, trademark, trade secret, copyright, or other proprietary rights</li>
                <li>Attempt to bypass any measures we use to restrict access or use of RadialWhisper</li>
                <li>Impersonate or misrepresent your affiliation with any person or entity</li>
                <li>Engage in any activity that interferes with or disrupts RadialWhisper (or servers and networks connected to RadialWhisper)</li>
                <li>Use RadialWhisper for commercial solicitation or advertising purposes</li>
                <li>Collect or store personal data about other users without their explicit consent</li>
                <li>Share or distribute inappropriate content, including explicit sexual content or violent material</li>
                <li>Use language or conduct that violates basic human ethics and respect</li>
              </ul>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Shield className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">5. Privacy and Location Data</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                5.1. RadialWhisper collects and processes location data to enable its core functionality. By using 
                RadialWhisper, you consent to the collection, use, and processing of your location data as described 
                in our Privacy Policy.
              </p>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                5.2. You may control the precision of location data shared with RadialWhisper through your device 
                settings and app permissions, but limiting such data may affect the functionality of the service.
              </p>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                5.3. RadialWhisper retains location data only for the time necessary to provide the service. Please refer to our 
                Privacy Policy for detailed information about our data practices.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Check className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">6. Content and Communications</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                6.1. You retain all rights to content you create, upload, or share through RadialWhisper. By 
                creating, uploading, or sharing content, you grant RadialWhisper a non-exclusive, royalty-free, 
                worldwide license to use, copy, modify, and display such content solely for the purpose of operating 
                and improving the RadialWhisper service.
              </p>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                6.2. We implement automatic message deletion to enhance privacy:
              </p>
              <ul className="text-[#D8D9DA] leading-relaxed list-disc pl-10 mt-2 space-y-2">
                <li>Messages between friends are retained for 48 hours</li>
                <li>Messages between nearby users are retained for 1 hour</li>
                <li>Unread messages are preserved for 60 hours</li>
              </ul>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                6.3. RadialWhisper does not guarantee the confidentiality, security, or privacy of your communications 
                on the platform. You acknowledge that any content you submit may be viewed by other users within your 
                proximity as determined by the app's functionality.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">7. Moderation and Enforcement</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                7.1. RadialWhisper reserves the right to monitor content and communications on the platform for 
                violations of these Terms. However, we do not undertake to pre-screen or constantly monitor all content.
              </p>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                7.2. We reserve the right to remove any content that violates these Terms or is otherwise objectionable.
              </p>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                7.3. RadialWhisper administrators and moderators have the authority to ban users who violate these Terms. 
                The decision to ban a user is at our sole discretion and may be implemented without prior notice.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Scale className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">8. Intellectual Property</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                8.1. RadialWhisper and its content, features, and functionality are owned by RadialWhisper and are 
                protected by international copyright, trademark, patent, trade secret, and other intellectual 
                property or proprietary rights laws.
              </p>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                8.2. You may not copy, modify, create derivative works, publicly display, publicly perform, republish, 
                download, store, transmit, or exploit any of the material on RadialWhisper, except as generally and 
                ordinarily permitted through RadialWhisper according to these Terms.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Shield className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">9. Limitation of Liability</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                9.1. To the maximum extent permitted by law, in no event shall RadialWhisper, its directors, employees, 
                partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible 
                losses, resulting from:
              </p>
              <ul className="text-[#D8D9DA] leading-relaxed list-disc pl-10 mt-2 space-y-2">
                <li>Your access to or use of or inability to access or use RadialWhisper</li>
                <li>Any conduct or content of any third party on RadialWhisper</li>
                <li>Any content obtained from RadialWhisper</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                <li>Interactions you have with other users of RadialWhisper</li>
              </ul>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Check className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">10. Disclaimer of Warranties</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                10.1. RadialWhisper is provided on an "AS IS" and "AS AVAILABLE" basis, without any warranties of any kind, 
                either express or implied, including, but not limited to, implied warranties of merchantability, fitness 
                for a particular purpose, or non-infringement.
              </p>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                10.2. RadialWhisper does not warrant that the service will be uninterrupted, secure, or error-free, that 
                defects will be corrected, or that RadialWhisper or the server that makes it available are free of viruses 
                or other harmful components.
              </p>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                10.3. RadialWhisper does not warrant or make any representations concerning the accuracy, reliability, or 
                quality of any information, content, or materials found on or obtained through RadialWhisper.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Scale className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">11. Termination</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                11.1. We may terminate or suspend your account immediately, without prior notice or liability, for any 
                reason whatsoever, including without limitation if you breach these Terms.
              </p>
              <p className="text-[#D8D9DA] leading-relaxed mt-4">
                11.2. Upon termination, your right to use RadialWhisper will immediately cease. If you wish to terminate 
                your account, you may simply discontinue using the service or request account deletion through the app settings.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">12. Governing Law</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws applicable in the jurisdiction 
                of our principal place of business, without regard to its conflict of law provisions.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Check className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">13. Changes to Terms</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision 
                is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. 
                What constitutes a material change will be determined at our sole discretion.
              </p>
            </div>
            
            <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="bg-[#FFF6E0]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h2 className="text-2xl font-bold">14. Contact Us</h2>
              </div>
              <p className="text-[#D8D9DA] leading-relaxed">
                If you have any questions about these Terms, please contact us through the app's contact form or via email.
              </p>
            </div>
          </div>
          
          {/* Agreement notice */}
          <div className="bg-[#31333A]/30 rounded-xl p-6 border border-[#61677A]/30 backdrop-blur-sm mt-8">
            <p className="text-[#D8D9DA] leading-relaxed">
              By using RadialWhisper, you acknowledge that you have read and understood these Terms and Conditions, 
              and agree to be bound by them. If you do not agree to all of these Terms, you are not authorized to use 
              RadialWhisper.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingTerms; 