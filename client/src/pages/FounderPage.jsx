import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, FileText, ExternalLink, Code, BookOpen, ArrowRight, Shield } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa'; // Import Instagram icon from react-icons
import { RiTwitterXFill } from 'react-icons/ri'; // Import X (Twitter) icon from react-icons
import AOS from 'aos';
import 'aos/dist/aos.css';
import { toast } from 'react-hot-toast'; // Import react-hot-toast
import jatinjatinimg from "../assets/images/JatinJaglanImg.jpeg";


const FounderPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      easing: 'ease-in-out',
    });
  }, []);
  window.scrollTo(0, 0);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.error('Somting went wrong!\n Try another way to contact me');
    // Clear form fields

    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-[#272829] text-[#FFF6E0] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#272829] opacity-90"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#272829] via-[#31333A] to-transparent opacity-90"></div>
      </div>
      
      {/* Animated floating orbs */}
      <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-30 animate-pulse" style={{animationDuration: '7s'}}></div>
      <div className="absolute bottom-60 left-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-20 animate-pulse" style={{animationDuration: '10s'}}></div>
      <div className="absolute top-20 left-1/4 w-40 h-40 rounded-full bg-[#FFF6E0] blur-[80px] opacity-10 animate-pulse" style={{animationDuration: '8s'}}></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="pt-24 pb-20 md:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Profile Image */}
              <div className="md:w-2/5 relative" data-aos="fade-right">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#61677A] to-[#D8D9DA] rounded-full opacity-30 blur-xl transform -translate-x-2 translate-y-2"></div>
                  
                  {/* Circular frame with border */}
                  <div className="relative rounded-full overflow-hidden border-4 border-[#FFF6E0]/20 shadow-2xl w-72 h-72 mx-auto">
                    <img
                      src={jatinjatinimg} 
                      alt="Jatin Jaglan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Status indicator */}
                  {/* <div className="absolute bottom-4 right-1/3 bg-green-500 w-6 h-6 rounded-full border-2 border-[#272829]"></div> */}
                </div>
              </div>
              
              {/* Bio Content */}
              <div className="md:w-3/5" data-aos="fade-left" data-aos-delay="200">
                <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                  Founder & Developer
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
                    Jatin Jaglan
                  </span>
                </h1>
                <p className="text-xl mb-8 text-[#D8D9DA] leading-relaxed">
                  Computer Science student passionate about creating intuitive technology that connects people. 
                  RadialWhisper is my vision to help people form meaningful local connections in an increasingly 
                  digital world.
                </p>
                
                {/* Social Links with custom hover colors */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <a
                    href="https://github.com/JatinJaglan347"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#31333A] hover:bg-[#24292e] px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Github className="h-5 w-5" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/jatinjaglan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#31333A] hover:bg-[#0077b5] px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://x.com/Jatin_Jaglan347"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#31333A] hover:bg-black px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <RiTwitterXFill className="h-5 w-5" />
                    <span>Twitter</span>
                  </a>
                  <a
                    href="https://instagram.com/jatinjaglan347"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#31333A] hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCAF45] px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <FaInstagram className="h-5 w-5" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href="mailto:jatinjaglan347@gmail.com"
                    className="flex items-center gap-2 bg-[#31333A] hover:bg-[#EA4335] px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Email</span>
                  </a>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/contact"
                    className="btn bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] px-6 py-3 rounded-full font-medium transition-all duration-300 inline-flex items-center"
                  >
                    Get in Touch
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <a
                    href="#projects"
                    className="btn btn-outline text-[#FFF6E0] border-[#FFF6E0] hover:bg-[#FFF6E0] hover:text-[#272829] hover:border-[#FFF6E0] px-6 py-3 rounded-full font-medium transition-all duration-300"
                  >
                    View My Work
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* About Section */}
        <div className="py-20 bg-gradient-to-br from-[#31333A] to-[#272829] relative overflow-hidden">
          <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-[#61677A] blur-[120px] opacity-5"></div>
          <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-[#61677A] blur-[150px] opacity-5"></div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16" data-aos="fade-up">
              <span className="bg-[#FFF6E0]/10 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                My Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The Journey Behind <span className="text-[#D8D9DA]">RadialWhisper</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-2xl border border-[#61677A]/30 shadow-xl">
                <h3 className="text-2xl font-bold mb-4">The Inspiration</h3>
                <p className="text-[#D8D9DA] leading-relaxed mb-6">
                  As a computer science student, I've always been fascinated by how technology can bring people 
                  together. The idea for RadialWhisper came during my second year of university when I noticed 
                  how difficult it was to meet new people despite being surrounded by thousands of students.
                </p>
                <p className="text-[#D8D9DA] leading-relaxed">
                  I wanted to create something that could bridge the gap between online and offline connections, 
                  making it easier to discover and connect with people in your immediate vicinity who share 
                  similar interests.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-2xl border border-[#61677A]/30 shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Education & Skills</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">B.E Computer Science</h4>
                    <p className="text-[#D8D9DA]">Chitkara University </p>
                  </div>
                  
                  <div className="pt-4 border-t border-[#61677A]/20">
                    <h4 className="font-semibold mb-3">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#61677A]/30 px-3 py-1 rounded-full text-sm">React</span>
                      <span className="bg-[#61677A]/30 px-3 py-1 rounded-full text-sm">JavaScript</span>
                      <span className="bg-[#61677A]/30 px-3 py-1 rounded-full text-sm">Node.js</span>
                      <span className="bg-[#61677A]/30 px-3 py-1 rounded-full text-sm">MongoDB</span>
                      <span className="bg-[#61677A]/30 px-3 py-1 rounded-full text-sm">Tailwind CSS</span>
                      <span className="bg-[#61677A]/30 px-3 py-1 rounded-full text-sm">Express</span>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Project Timeline */}
        <div id="projects" className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16" data-aos="fade-up">
              <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                My Work
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
                  Project Timeline
                </span>
              </h2>
              <p className="text-lg text-[#D8D9DA] max-w-2xl mx-auto">
                The development journey of RadialWhisper and other notable projects I've created during my studies.
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-[#61677A]/30 transform md:translate-x-[-0.5px]"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                {/* RadialWhisper */}
                <div className="relative" data-aos="fade-up">
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="md:w-1/2 md:text-right md:pr-12">
                      <div className="hidden md:block absolute right-0 top-0 w-3 h-3 bg-[#FFF6E0] rounded-full transform translate-x-[-50%] md:translate-x-0"></div>
                      <span className="bg-[#FFF6E0]/10 text-[#FFF6E0] px-3 py-1 rounded-full text-xs font-medium inline-block mb-2">
                        2025 - Present
                      </span>
                      <h3 className="text-2xl font-bold mb-2">RadialWhisper</h3>
                      <p className="text-[#D8D9DA] leading-relaxed">
                        A proximity-based chat application that connects users within customizable 
                        radius settings. Built with React, Node.js, and MongoDB.
                      </p>
                    </div>
                    <div className="md:w-1/2 md:pl-12">
                      <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-4 rounded-xl border border-[#61677A]/30 shadow-lg">
                        <img 
                          src="/api/placeholder/400/200" 
                          alt="RadialWhisper Project Screenshot"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Student Hub */}
                <div className="relative" data-aos="fade-up">
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="md:w-1/2 md:pr-12 order-2 md:order-1">
                      <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-4 rounded-xl border border-[#61677A]/30 shadow-lg">
                        <img 
                          src="/api/placeholder/400/200" 
                          alt="Student Hub Project Screenshot"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="md:w-1/2 md:text-left md:pl-12 order-1 md:order-2">
                      <div className="hidden md:block absolute left-0 top-0 w-3 h-3 bg-[#FFF6E0] rounded-full transform translate-x-[-50%]"></div>
                      <span className="bg-[#FFF6E0]/10 text-[#FFF6E0] px-3 py-1 rounded-full text-xs font-medium inline-block mb-2">
                        2024
                      </span>
                      <h3 className="text-2xl font-bold mb-2">Student Hub</h3>
                      <p className="text-[#D8D9DA] leading-relaxed">
                        A resource sharing platform for university students with features for 
                        notes exchange, event notifications, and study group formation.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Weather Data Visualizer */}
                <div className="relative" data-aos="fade-up">
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="md:w-1/2 md:text-right md:pr-12">
                      <div className="hidden md:block absolute right-0 top-0 w-3 h-3 bg-[#FFF6E0] rounded-full transform translate-x-[-50%] md:translate-x-0"></div>
                      <span className="bg-[#FFF6E0]/10 text-[#FFF6E0] px-3 py-1 rounded-full text-xs font-medium inline-block mb-2">
                        2023
                      </span>
                      <h3 className="text-2xl font-bold mb-2">Weather Data Visualizer</h3>
                      <p className="text-[#D8D9DA] leading-relaxed">
                        An interactive weather data visualization tool built with D3.js and React,
                        featuring historical weather patterns and forecasting.
                      </p>
                    </div>
                    <div className="md:w-1/2 md:pl-12">
                      <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-4 rounded-xl border border-[#61677A]/30 shadow-lg">
                        <img 
                          src="/api/placeholder/400/200" 
                          alt="Weather Data Visualizer Project Screenshot"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center" data-aos="fade-up">
              <a 
                href="https://github.com/JatinJaglan347" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-full bg-[#61677A]/30 hover:bg-[#61677A]/50 text-[#FFF6E0] font-medium transition-all duration-300 border border-[#FFF6E0]/20 hover:border-[#FFF6E0]/40"
              >
                See more projects
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Vision & Philosophy */}
        <div className="py-20 bg-gradient-to-br from-[#31333A] to-[#272829] relative overflow-hidden">
          <div className="absolute top-1/4 right-10 w-72 h-72 rounded-full bg-[#61677A] blur-[120px] opacity-5"></div>
          <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-[#61677A] blur-[150px] opacity-5"></div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16" data-aos="fade-up">
              <span className="bg-[#FFF6E0]/10 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                My Philosophy
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Vision & Values
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-2xl border border-[#61677A]/30 shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFF6E0] to-[#D8D9DA] rounded-full flex items-center justify-center mb-6">
                  <Code className="h-6 w-6 text-[#272829]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Technology with Purpose</h3>
                <p className="text-[#D8D9DA] leading-relaxed">
                  I believe technology should solve real human problems. Every feature in 
                  RadialWhisper is designed with the purpose of making meaningful connections easier.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-2xl border border-[#61677A]/30 shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFF6E0] to-[#D8D9DA] rounded-full flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-[#272829]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Privacy & Safety First</h3>
                <p className="text-[#D8D9DA] leading-relaxed">
                  I'm committed to creating digital spaces where users feel safe. RadialWhisper 
                  is built with privacy at its core, giving users control over their information.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-2xl border border-[#61677A]/30 shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFF6E0] to-[#D8D9DA] rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="h-6 w-6 text-[#272829]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Continuous Learning</h3>
                <p className="text-[#D8D9DA] leading-relaxed">
                  As a student developer, I embrace the journey of constant learning and improvement.
                  RadialWhisper evolves with the feedback and needs of its users.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Get in Touch */}
        <div className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12" data-aos="fade-up">
              <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                Connect
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
                  Get in Touch
                </span>
              </h2>
              <p className="text-lg text-[#D8D9DA] max-w-2xl mx-auto">
                Have questions about RadialWhisper? Want to collaborate on a project? 
                I'm always open to connecting with fellow developers and enthusiasts.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-[#31333A] to-[#272829] p-8 rounded-2xl border border-[#61677A]/30 shadow-xl" data-aos="fade-up" data-aos-delay="100">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-[#D8D9DA]" />
                      <a href="mailto:jatinjaglan347@gmail.com" className="text-[#FFF6E0] hover:text-[#D8D9DA] transition-colors">
                        jatinjaglan347@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <RiTwitterXFill className="h-5 w-5 text-[#D8D9DA]" />
                      <a href="https://x.com/Jatin_Jaglan347" target="_blank" rel="noopener noreferrer" className="text-[#FFF6E0] hover:text-[#D8D9DA] transition-colors">
                        @Jatin_Jaglan347
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-5 w-5 text-[#D8D9DA]" />
                      <a href="https://www.linkedin.com/in/jatinjaglan" target="_blank" rel="noopener noreferrer" className="text-[#FFF6E0] hover:text-[#D8D9DA] transition-colors">
                        linkedin.com/in/jatinjaglan
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaInstagram className="h-5 w-5 text-[#D8D9DA]" />
                      <a href="https://instagram.com/jatinjaglan347" target="_blank" rel="noopener noreferrer" className="text-[#FFF6E0] hover:text-[#D8D9DA] transition-colors">
                        @jatinjaglan347
                      </a>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Also Available For</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#61677A]/30 px-3 py-1 rounded-full text-sm">Freelance Projects</span>
                      <span className="bg-[#61677A]/30 px-3 py-1 rounded-full text-sm">Collaboration</span>
                      <span className="bg-[#61677A]/30 px-3 py-1 rounded-full text-sm">Open Source</span>
                      <span className="bg-[#61677A]/30 px-3 py-1 rounded-full text-sm">Speaking</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 md:border-l md:border-[#61677A]/30 md:pl-8">
                  <h3 className="text-xl font-bold mb-4">Quick Message</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        className="w-full bg-[#272829] border border-[#61677A]/30 rounded-lg p-3 text-[#FFF6E0] placeholder:text-[#D8D9DA]/50 focus:outline-none focus:border-[#FFF6E0]/50"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <input 
                        type="email" 
                        placeholder="Your Email" 
                        className="w-full bg-[#272829] border border-[#61677A]/30 rounded-lg p-3 text-[#FFF6E0] placeholder:text-[#D8D9DA]/50 focus:outline-none focus:border-[#FFF6E0]/50"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <textarea 
                        placeholder="Your Message" 
                        rows="4"
                        className="w-full bg-[#272829] border border-[#61677A]/30 rounded-lg p-3 text-[#FFF6E0] placeholder:text-[#D8D9DA]/50 focus:outline-none focus:border-[#FFF6E0]/50"
                        required
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] px-6 py-3 rounded-lg font-medium transition-all duration-300"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default FounderPage;