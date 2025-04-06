import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, FileText, ExternalLink, Code, BookOpen, ArrowRight, Shield, ChevronDown } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa'; // Import Instagram icon from react-icons
import { RiTwitterXFill } from 'react-icons/ri'; // Import X (Twitter) icon from react-icons
import AOS from 'aos';
import 'aos/dist/aos.css';
import { toast } from 'react-hot-toast'; // Import react-hot-toast
import jatinjatinimg from "../assets/images/JatinJaglanImg.jpeg";
import thealgoshowimg from "../assets/images/ProjectImges/TheAlgoShowImg.png";
import chitkaraconnectimg from "../assets/images/ProjectImges/ChitkaraConnectImg.png";


const FounderPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      easing: 'ease-in-out',
    });
  }, []);
  
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.error('Something went wrong!\n Try another way to contact me');
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-[#272829] text-[#FFF6E0] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#272829] opacity-90"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#272829] via-[#31333A] to-transparent opacity-90"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, #FFF6E0 1px, transparent 1px), linear-gradient(to bottom, #FFF6E0 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Decorative shapes */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full border border-[#FFF6E0]/10 opacity-30"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full border border-[#FFF6E0]/5 opacity-20"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border border-[#FFF6E0]/10 opacity-10"></div>
      </div>
      
      {/* Animated floating orbs */}
      <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-30 animate-pulse" style={{animationDuration: '7s'}}></div>
      <div className="absolute bottom-60 left-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-20 animate-pulse" style={{animationDuration: '10s'}}></div>
      <div className="absolute top-20 left-1/4 w-40 h-40 rounded-full bg-[#FFF6E0] blur-[80px] opacity-10 animate-pulse" style={{animationDuration: '8s'}}></div>
      
      {/* Scroll indicator */}
      <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ${scrolled ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex flex-col items-center">
          <span className="text-[#FFF6E0]/70 text-sm mb-2">Scroll to explore</span>
          <div className="animate-bounce">
            <ChevronDown className="h-6 w-6 text-[#FFF6E0]/70" />
          </div>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex items-center pt-24 pb-20 md:py-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Profile Image with improved styling */}
              <div className="md:w-2/5 relative" data-aos="fade-right">
                <div className="relative group">
                  {/* Animated glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#61677A] to-[#D8D9DA] rounded-full opacity-30 blur-xl transform group-hover:scale-110 transition-transform duration-700 ease-in-out"></div>
                  
                  {/* Circular frame with animated border */}
                  <div className="relative rounded-full overflow-hidden shadow-2xl w-72 h-72 mx-auto">
                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFF6E0]/30 via-[#61677A]/30 to-[#FFF6E0]/30 animate-spin-slow" style={{animationDuration: '8s'}}></div>
                    
                    {/* Image container */}
                    <div className="absolute inset-[3px] rounded-full overflow-hidden bg-[#272829]">
                      <img
                        src={jatinjatinimg} 
                        alt="Jatin Jaglan"
                        className="w-full h-full object-cover scale-[1.02] hover:scale-[1.05] transition-all duration-500"
                      />
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] opacity-70 blur-sm"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-[#61677A] opacity-70 blur-sm"></div>
                </div>
              </div>
              
              {/* Bio Content with improved typography and animations */}
              <div className="md:w-3/5" data-aos="fade-left" data-aos-delay="200">
                <div className="relative">
                  <span className="inline-block absolute -top-6 -left-6 text-6xl opacity-20 font-serif">"</span>
                  <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4 backdrop-blur-sm">
                    Founder & Developer
                  </span>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 relative">
                    <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text relative z-10">
                      Jatin Jaglan
                    </span>
                    <div className="absolute -bottom-2 left-0 h-1 w-24 bg-gradient-to-r from-[#FFF6E0] to-transparent rounded-full"></div>
                  </h1>
                  <p className="text-xl mb-8 text-[#D8D9DA] leading-relaxed max-w-2xl">
                    Computer Science student passionate about creating intuitive technology that connects people. 
                    RadialWhisper is my vision to help people form meaningful local connections in an increasingly 
                    digital world.
                  </p>
                  
                  {/* Social Links with enhanced hover effects */}
                  <div className="flex flex-wrap gap-4 mb-8 group">
                    <a
                      href="https://github.com/JatinJaglan347"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#31333A] hover:bg-[#24292e] px-4 py-2 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#24292e]/20"
                    >
                      <Github className="h-5 w-5" />
                      <span>GitHub</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/jatinjaglan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#31333A] hover:bg-[#0077b5] px-4 py-2 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0077b5]/20"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href="https://x.com/Jatin_Jaglan347"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#31333A] hover:bg-black px-4 py-2 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20"
                    >
                      <RiTwitterXFill className="h-5 w-5" />
                      <span>Twitter</span>
                    </a>
                    <a
                      href="https://instagram.com/jatinjaglan347"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#31333A] hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCAF45] px-4 py-2 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FD1D1D]/20"
                    >
                      <FaInstagram className="h-5 w-5" />
                      <span>Instagram</span>
                    </a>
                    <a
                      href="mailto:jatinjaglan347@gmail.com"
                      className="flex items-center gap-2 bg-[#31333A] hover:bg-[#EA4335] px-4 py-2 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#EA4335]/20"
                    >
                      <Mail className="h-5 w-5" />
                      <span>Email</span>
                    </a>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to="/contact"
                      className="btn group relative overflow-hidden bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] px-6 py-3 rounded-full font-medium transition-all duration-500 inline-flex items-center"
                    >
                      <span className="relative z-10">Get in Touch</span>
                      <span className="relative z-10 ml-2 group-hover:translate-x-1 transition-transform duration-300">
                        <ArrowRight className="h-5 w-5" />
                      </span>
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                    </Link>
                    <a
                      href="#projects"
                      className="btn relative overflow-hidden text-[#FFF6E0] border-2 border-[#FFF6E0]/30 hover:border-[#FFF6E0] px-6 py-3 rounded-full font-medium transition-all duration-300 group"
                    >
                      <span className="relative z-10">View My Work</span>
                      <span className="absolute inset-0 bg-[#FFF6E0]/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* About Section */}
        <div className="py-20 bg-gradient-to-br from-[#31333A] to-[#272829] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-[#61677A]/10 to-transparent opacity-30"></div>
          <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-[#61677A] blur-[120px] opacity-5"></div>
          <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-[#61677A] blur-[150px] opacity-5"></div>
          
          {/* Stylized dots pattern */}
          <div className="absolute left-0 top-0 h-full w-24 opacity-20">
            <div className="h-full w-full" style={{
              backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16" data-aos="fade-up">
              <div className="flex items-center justify-center mb-4">
                <div className="h-[1px] w-12 bg-[#FFF6E0]/30"></div>
                <span className="bg-[#FFF6E0]/10 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mx-4 backdrop-blur-sm">
                  My Story
                </span>
                <div className="h-[1px] w-12 bg-[#FFF6E0]/30"></div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 relative inline-block">
                The Journey Behind <span className="text-[#D8D9DA]">RadialWhisper</span>
                <div className="absolute -bottom-2 left-1/2 h-1 w-24 bg-gradient-to-r from-transparent via-[#FFF6E0] to-transparent rounded-full transform -translate-x-1/2"></div>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12" data-aos="fade-up" data-aos-delay="100">
              <div className="group relative bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-2xl border border-[#61677A]/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-[#FFF6E0]/20">
                {/* Hover glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FFF6E0]/0 via-[#FFF6E0]/20 to-[#FFF6E0]/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"></div>
                
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#61677A]/20 mr-4">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">The Inspiration</h3>
                  </div>
                  <p className="text-[#D8D9DA] leading-relaxed mb-6">
                    As a computer science student, I've always been fascinated by how technology can bring people 
                    together. The idea for RadialWhisper came during my second year of university when I noticed 
                    how difficult it was to meet new people despite being surrounded by thousands of students.
                  </p>
                  <p className="text-[#D8D9DA] leading-relaxed relative">
                    I wanted to create something that could bridge the gap between online and offline connections, 
                    making it easier to discover and connect with people in your immediate vicinity who share 
                    similar interests.
                    
                    {/* Decorative quote mark */}
                    <span className="absolute -bottom-4 -right-2 text-4xl opacity-20 font-serif">"</span>
                  </p>
                  
                  {/* Project buttons */}
                  <div className="flex gap-3 justify-end mt-6 mb-6">
                    <Link to="/" className="bg-[#FFF6E0] text-[#272829] px-4 py-2 rounded-full flex items-center gap-2 hover:-translate-y-1 transition-transform duration-300">
                      <span>View Project</span>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <a href="https://github.com/JatinJaglan347/RadialWhisper" target="_blank" rel="noopener noreferrer" className="bg-[#272829] text-[#FFF6E0] border border-[#FFF6E0]/30 px-4 py-2 rounded-full flex items-center gap-2 hover:-translate-y-1 transition-transform duration-300 hover:bg-[#31333A]">
                      <span>GitHub</span>
                      <Github className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="group relative bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-2xl border border-[#61677A]/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-[#FFF6E0]/20">
                {/* Hover glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FFF6E0]/0 via-[#FFF6E0]/20 to-[#FFF6E0]/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"></div>
                
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#61677A]/20 mr-4">
                      <Code className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Education & Skills</h3>
                  </div>
                  
                  <div className="mb-6">
                    <div className="bg-[#31333A]/50 p-4 rounded-lg border border-[#61677A]/20">
                      <h4 className="font-semibold text-lg flex items-center">
                        <span className="inline-block w-2 h-2 bg-[#FFF6E0] rounded-full mr-2"></span>
                        B.E Computer Science
                      </h4>
                      <p className="text-[#D8D9DA] ml-4 pl-2 border-l border-[#61677A]/30 mt-1">Chitkara University</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <span className="inline-block w-2 h-2 bg-[#FFF6E0] rounded-full mr-2"></span>
                      Technical Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'JavaScript', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Express'].map((skill, index) => (
                        <span 
                          key={index}
                          className="bg-[#61677A]/30 px-3 py-1 rounded-full text-sm border border-transparent hover:border-[#FFF6E0]/20 transition-colors duration-300 cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
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
              <div className="flex items-center justify-center mb-4">
                <div className="h-[1px] w-12 bg-[#61677A]/50"></div>
                <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mx-4 backdrop-blur-sm">
                  My Work
                </span>
                <div className="h-[1px] w-12 bg-[#61677A]/50"></div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 relative inline-block">
                <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
                  Project Timeline
                </span>
                <div className="absolute -bottom-2 left-1/2 h-1 w-24 bg-gradient-to-r from-transparent via-[#FFF6E0] to-transparent rounded-full transform -translate-x-1/2"></div>
              </h2>
              <p className="text-lg text-[#D8D9DA] max-w-2xl mx-auto">
                The development journey of RadialWhisper and other notable projects I've created during my studies.
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline line with glowing effect */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#FFF6E0]/10 via-[#FFF6E0]/30 to-[#FFF6E0]/10 transform md:translate-x-[-0.5px]"></div>
              
              {/* Timeline items */}
              <div className="space-y-24">
                {/* RadialWhisper */}
                <div className="relative" data-aos="fade-up">
                  <div className="flex flex-col md:flex-row items-start">
                    <div className="md:w-1/2 md:pr-16 md:text-right order-2 md:order-1">
                      {/* Timeline node */}
                      <div className="hidden md:block absolute right-0 top-8 w-4 h-4 bg-[#FFF6E0] rounded-full transform translate-x-[0.5px] md:translate-x-[-50%] shadow-[0_0_15px_rgba(255,246,224,0.5)] z-10"></div>
                      
                      <span className="bg-[#FFF6E0]/10 text-[#FFF6E0] px-3 py-1 rounded-full text-xs font-medium inline-block mb-3 backdrop-blur-sm">
                        2025 - Present
                      </span>
                      <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">RadialWhisper</h3>
                      <p className="text-[#D8D9DA] leading-relaxed mb-6">
                        A proximity-based social app where users set their preferred radius to discover and chat with 
                        nearby people anonymously. Only interests are displayed initially, preserving privacy while 
                        fostering genuine connections. If users connect well, they can add each other as friends, 
                        revealing their identities and enabling chats from anywhere, not just within proximity.
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 justify-end mb-8 md:mb-0">
                        {["React", "Node.js","Express", "MongoDB","Tailwind CSS", "Socket.io"].map((tag, i) => (
                          <span key={i} className="bg-[#61677A]/20 px-2 py-1 rounded-md text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Project buttons */}
                      <div className="flex gap-3 justify-end mt-6 mb-6">
                        <Link to="/" className="bg-[#FFF6E0] text-[#272829] px-4 py-2 rounded-full flex items-center gap-2 hover:-translate-y-1 transition-transform duration-300">
                          <span>View Project</span>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <a href="https://github.com/JatinJaglan347/RadialWhisper" target="_blank" rel="noopener noreferrer" className="bg-[#272829] text-[#FFF6E0] border border-[#FFF6E0]/30 px-4 py-2 rounded-full flex items-center gap-2 hover:-translate-y-1 transition-transform duration-300 hover:bg-[#31333A]">
                          <span>GitHub</span>
                          <Github className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                    
                    <div className="md:w-1/2 md:pl-16 order-1 md:order-2 mb-6 md:mb-0">
                      <div className="group relative overflow-hidden rounded-xl border border-[#61677A]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#FFF6E0]/5 hover:border-[#FFF6E0]/20">
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#61677A]/0 via-[#61677A]/30 to-[#61677A]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>
                        
                        <div className="relative">
                          <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-1">
                            <img 
                              src="/api/placeholder/400/200" 
                              alt="RadialWhisper Project Screenshot"
                              className="w-full h-auto rounded-lg filter brightness-90 group-hover:brightness-110 transition-all duration-500"
                            />
                          </div>
                          
                          {/* Project link overlay */}
                          <div className="absolute inset-0 bg-[#272829]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex gap-3">
                              <Link to="/" className="bg-[#FFF6E0] text-[#272829] px-4 py-2 rounded-full flex items-center gap-2 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <span>View Project</span>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                              <a href="https://github.com/JatinJaglan347/RadialWhisper" target="_blank" rel="noopener noreferrer" className="bg-[#272829] text-[#FFF6E0] border border-[#FFF6E0]/30 px-4 py-2 rounded-full flex items-center gap-2 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#31333A]">
                                <span>GitHub</span>
                                <Github className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Chitkara Connect */}
                <div className="relative" data-aos="fade-up">
                  <div className="flex flex-col md:flex-row items-start">
                    <div className="md:w-1/2 md:pl-16 order-2">
                      {/* Timeline node */}
                      <div className="hidden md:block absolute left-0 top-8 w-4 h-4 bg-[#FFF6E0] rounded-full transform translate-x-[-0.5px] md:translate-x-[-50%] shadow-[0_0_15px_rgba(255,246,224,0.5)] z-10"></div>
                      
                      <span className="bg-[#FFF6E0]/10 text-[#FFF6E0] px-3 py-1 rounded-full text-xs font-medium inline-block mb-3 backdrop-blur-sm">
                        2024
                      </span>
                      <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Chitkara Connect</h3>
                      <p className="text-[#D8D9DA] leading-relaxed mb-6">
                        Enhanced version of ChakpadPro with a more intuitive interface. Features community forums 
                        where students can discuss and share opinions about university life, along with resource sharing 
                        and study group formation.
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-8 md:mb-0">
                        {["React", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"].map((tag, i) => (
                          <span key={i} className="bg-[#61677A]/20 px-2 py-1 rounded-md text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Project buttons */}
                      <div className="flex gap-3 mt-6 mb-6">
                        <a href="https://chitkara-connect.vercel.app/" target="_blank" rel="noopener noreferrer" className="bg-[#FFF6E0] text-[#272829] px-4 py-2 rounded-full flex items-center gap-2 hover:-translate-y-1 transition-transform duration-300">
                          <span>View Project</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <a href="https://github.com/JatinJaglan347/chitkara-connect" target="_blank" rel="noopener noreferrer" className="bg-[#272829] text-[#FFF6E0] border border-[#FFF6E0]/30 px-4 py-2 rounded-full flex items-center gap-2 hover:-translate-y-1 transition-transform duration-300 hover:bg-[#31333A]">
                          <span>GitHub</span>
                          <Github className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                    
                    <div className="md:w-1/2 md:pr-16 order-1 mb-6 md:mb-0">
                      <div className="group relative overflow-hidden rounded-xl border border-[#61677A]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#FFF6E0]/5 hover:border-[#FFF6E0]/20">
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#61677A]/0 via-[#61677A]/30 to-[#61677A]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>
                        
                        <div className="relative">
                          <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-1">
                            <img 
                              src={chitkaraconnectimg}
                              alt="Chitkara Connect Project Screenshot"
                              className="w-full h-auto rounded-lg filter brightness-90 group-hover:brightness-110 transition-all duration-500"
                            />
                          </div>
                          
                          {/* Project link overlay */}
                          <div className="absolute inset-0 bg-[#272829]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex gap-3">
                              <a href="https://chitkara-connect.vercel.app/" target='_blank' className="bg-[#FFF6E0] text-[#272829] px-4 py-2 rounded-full flex items-center gap-2 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <span>View Project</span>
                                <ExternalLink className="h-4 w-4" />
                              </a>
                              <a href="https://github.com/JatinJaglan347/chitkara-connect" target="_blank" rel="noopener noreferrer" className="bg-[#272829] text-[#FFF6E0] border border-[#FFF6E0]/30 px-4 py-2 rounded-full flex items-center gap-2 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#31333A]">
                                <span>GitHub</span>
                                <Github className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* The Algo Show */}
                <div className="relative" data-aos="fade-up">
                  <div className="flex flex-col md:flex-row items-start">
                    <div className="md:w-1/2 md:pr-16 md:text-right order-2 md:order-1">
                      {/* Timeline node */}
                      <div className="hidden md:block absolute right-0 top-8 w-4 h-4 bg-[#FFF6E0] rounded-full transform translate-x-[0.5px] md:translate-x-[-50%] shadow-[0_0_15px_rgba(255,246,224,0.5)] z-10"></div>
                      
                      <span className="bg-[#FFF6E0]/10 text-[#FFF6E0] px-3 py-1 rounded-full text-xs font-medium inline-block mb-3 backdrop-blur-sm">
                        2023
                      </span>
                      <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">The Algo Show</h3>
                      <p className="text-[#D8D9DA] leading-relaxed mb-6">
                        An algorithm visualization platform where users can see sorting algorithms in action, 
                        understand how they work through detailed explanations, and view implementations in 
                        popular programming languages.
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 justify-end">
                        {["React", "JavaScript", "Tailwind CSS"].map((tag, i) => (
                          <span key={i} className="bg-[#61677A]/20 px-2 py-1 rounded-md text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Project buttons */}
                      <div className="flex gap-3 justify-end mt-6 mb-6">
                        <a href="https://the-algo-show.vercel.app/" target="_blank" rel="noopener noreferrer" className="bg-[#FFF6E0] text-[#272829] px-4 py-2 rounded-full flex items-center gap-2 hover:-translate-y-1 transition-transform duration-300">
                          <span>View Project</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <a href="https://github.com/JatinJaglan347/The-Algo-Show" target="_blank" rel="noopener noreferrer" className="bg-[#272829] text-[#FFF6E0] border border-[#FFF6E0]/30 px-4 py-2 rounded-full flex items-center gap-2 hover:-translate-y-1 transition-transform duration-300 hover:bg-[#31333A]">
                          <span>GitHub</span>
                          <Github className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                    
                    <div className="md:w-1/2 md:pl-16 order-1 md:order-2 mb-6 md:mb-0">
                      <div className="group relative overflow-hidden rounded-xl border border-[#61677A]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#FFF6E0]/5 hover:border-[#FFF6E0]/20">
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#61677A]/0 via-[#61677A]/30 to-[#61677A]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>
                        
                        <div className="relative">
                          <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-1">
                            <img 
                              src={thealgoshowimg} 
                              alt="The Algo Show Project Screenshot"
                              className="w-full h-auto rounded-lg filter brightness-90 group-hover:brightness-110 transition-all duration-500"
                            />
                          </div>
                          
                          {/* Project link overlay */}
                          <div className="absolute inset-0 bg-[#272829]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex gap-3">
                              <a href="https://the-algo-show.vercel.app/" target='_blank' className="bg-[#FFF6E0] text-[#272829] px-4 py-2 rounded-full flex items-center gap-2 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <span>View Project</span>
                                <ExternalLink className="h-4 w-4" />
                              </a>
                              <a href="https://github.com/JatinJaglan347/The-Algo-Show" target="_blank" rel="noopener noreferrer" className="bg-[#272829] text-[#FFF6E0] border border-[#FFF6E0]/30 px-4 py-2 rounded-full flex items-center gap-2 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#31333A]">
                                <span>GitHub</span>
                                <Github className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-20 text-center" data-aos="fade-up">
              <a 
                href="https://github.com/JatinJaglan347" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center px-6 py-3 rounded-full bg-[#61677A]/30 hover:bg-[#61677A]/50 text-[#FFF6E0] font-medium transition-all duration-300 border border-[#FFF6E0]/20 hover:border-[#FFF6E0]/40 hover:shadow-lg hover:shadow-[#61677A]/20"
              >
                <span>See more projects</span>
                <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Vision & Philosophy */}
        <div className="py-20 bg-gradient-to-br from-[#31333A] to-[#272829] relative overflow-hidden">
          {/* Decorative patterns */}
          <div className="absolute top-0 left-0 w-full h-24 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 Z" fill="#FFF6E0" fillOpacity="0.1" />
            </svg>
          </div>
          
          <div className="absolute bottom-0 right-0 w-full h-32 opacity-10 transform rotate-180">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 Z" fill="#FFF6E0" fillOpacity="0.1" />
            </svg>
          </div>
          
          <div className="absolute top-1/4 right-10 w-72 h-72 rounded-full bg-[#61677A] blur-[120px] opacity-5"></div>
          <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-[#61677A] blur-[150px] opacity-5"></div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16" data-aos="fade-up">
              <div className="flex items-center justify-center mb-4">
                <div className="h-[1px] w-12 bg-[#FFF6E0]/30"></div>
                <span className="bg-[#FFF6E0]/10 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mx-4 backdrop-blur-sm">
                  My Philosophy
                </span>
                <div className="h-[1px] w-12 bg-[#FFF6E0]/30"></div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 relative inline-block">
                Vision & Values
                <div className="absolute -bottom-2 left-1/2 h-1 w-24 bg-gradient-to-r from-transparent via-[#FFF6E0] to-transparent rounded-full transform -translate-x-1/2"></div>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="100">
              {/* Technology with Purpose Card */}
              <div className="group relative bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-2xl border border-[#61677A]/30 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:border-[#FFF6E0]/20 h-full flex flex-col">
                {/* Card background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#FFF6E0" strokeWidth="1" fill="none" />
                    <circle cx="50" cy="50" r="30" stroke="#FFF6E0" strokeWidth="1" fill="none" />
                    <circle cx="50" cy="50" r="20" stroke="#FFF6E0" strokeWidth="1" fill="none" />
                  </svg>
                </div>
                
                {/* Hover animation for icon */}
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFF6E0]/10 to-[#FFF6E0]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 backdrop-blur-sm border border-[#FFF6E0]/10">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFF6E0] to-[#D8D9DA] rounded-xl flex items-center justify-center">
                      <Code className="h-6 w-6 text-[#272829]" />
                    </div>
                  </div>
                  
                  {/* Decorative line */}
                  <div className="absolute top-1/2 left-16 right-8 h-[1px] bg-gradient-to-r from-[#FFF6E0]/30 to-transparent transform -translate-y-1/2"></div>
                </div>
                
                <h3 className="text-xl font-bold mb-4 group-hover:text-[#FFF6E0] transition-colors duration-300">Technology with Purpose</h3>
                <p className="text-[#D8D9DA] leading-relaxed flex-grow">
                  I believe technology should solve real human problems. Every feature in 
                  RadialWhisper is designed with the purpose of making meaningful connections easier.
                </p>
                
                {/* Bottom decoration */}
                <div className="mt-6 w-12 h-1 bg-gradient-to-r from-[#FFF6E0]/30 to-transparent rounded-full transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
              </div>
              
              {/* Privacy & Safety Card */}
              <div className="group relative bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-2xl border border-[#61677A]/30 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:border-[#FFF6E0]/20 h-full flex flex-col">
                {/* Card background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <polygon points="50,15 100,100 0,100" stroke="#FFF6E0" strokeWidth="1" fill="none" />
                    <polygon points="50,30 85,85 15,85" stroke="#FFF6E0" strokeWidth="1" fill="none" />
                  </svg>
                </div>
                
                {/* Hover animation for icon */}
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFF6E0]/10 to-[#FFF6E0]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 backdrop-blur-sm border border-[#FFF6E0]/10">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFF6E0] to-[#D8D9DA] rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-[#272829]" />
                    </div>
                  </div>
                  
                  {/* Decorative line */}
                  <div className="absolute top-1/2 left-16 right-8 h-[1px] bg-gradient-to-r from-[#FFF6E0]/30 to-transparent transform -translate-y-1/2"></div>
                </div>
                
                <h3 className="text-xl font-bold mb-4 group-hover:text-[#FFF6E0] transition-colors duration-300">Privacy & Safety First</h3>
                <p className="text-[#D8D9DA] leading-relaxed flex-grow">
                  I'm committed to creating digital spaces where users feel safe. RadialWhisper 
                  is built with privacy at its core, giving users control over their information.
                </p>
                
                {/* Bottom decoration */}
                <div className="mt-6 w-12 h-1 bg-gradient-to-r from-[#FFF6E0]/30 to-transparent rounded-full transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
              </div>
              
              {/* Continuous Learning Card */}
              <div className="group relative bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-2xl border border-[#61677A]/30 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:border-[#FFF6E0]/20 h-full flex flex-col">
                {/* Card background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <rect x="20" y="20" width="60" height="60" stroke="#FFF6E0" strokeWidth="1" fill="none" />
                    <rect x="35" y="35" width="30" height="30" stroke="#FFF6E0" strokeWidth="1" fill="none" />
                  </svg>
                </div>
                
                {/* Hover animation for icon */}
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFF6E0]/10 to-[#FFF6E0]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 backdrop-blur-sm border border-[#FFF6E0]/10">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFF6E0] to-[#D8D9DA] rounded-xl flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-[#272829]" />
                    </div>
                  </div>
                  
                  {/* Decorative line */}
                  <div className="absolute top-1/2 left-16 right-8 h-[1px] bg-gradient-to-r from-[#FFF6E0]/30 to-transparent transform -translate-y-1/2"></div>
                </div>
                
                <h3 className="text-xl font-bold mb-4 group-hover:text-[#FFF6E0] transition-colors duration-300">Continuous Learning</h3>
                <p className="text-[#D8D9DA] leading-relaxed flex-grow">
                  As a student developer, I embrace the journey of constant learning and improvement.
                  RadialWhisper evolves with the feedback and needs of its users.
                </p>
                
                {/* Bottom decoration */}
                <div className="mt-6 w-12 h-1 bg-gradient-to-r from-[#FFF6E0]/30 to-transparent rounded-full transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Get in Touch */}
        <div className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12" data-aos="fade-up">
              <div className="flex items-center justify-center mb-4">
                <div className="h-[1px] w-12 bg-[#61677A]/50"></div>
                <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mx-4 backdrop-blur-sm">
                  Connect
                </span>
                <div className="h-[1px] w-12 bg-[#61677A]/50"></div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 relative inline-block">
                <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
                  Get in Touch
                </span>
                <div className="absolute -bottom-2 left-1/2 h-1 w-24 bg-gradient-to-r from-transparent via-[#FFF6E0] to-transparent rounded-full transform -translate-x-1/2"></div>
              </h2>
              <p className="text-lg text-[#D8D9DA] max-w-2xl mx-auto">
                Have questions about RadialWhisper? Want to collaborate on a project? 
                I'm always open to connecting with fellow developers and enthusiasts.
              </p>
            </div>
            
            <div className="relative bg-gradient-to-br from-[#31333A] to-[#272829] rounded-3xl border border-[#61677A]/30 shadow-2xl overflow-hidden" data-aos="fade-up" data-aos-delay="100">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="h-full w-full" style={{
                  backgroundImage: `radial-gradient(circle at 20% 30%, #FFF6E0 1px, transparent 1px),
                                    radial-gradient(circle at 80% 70%, #FFF6E0 1px, transparent 1px)`,
                  backgroundSize: '60px 60px'
                }}></div>
              </div>
              
              {/* Top decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFF6E0]/30 to-transparent"></div>
              
              <div className="flex flex-col md:flex-row relative">
                {/* Contact Information */}
                <div className="md:w-1/2 p-8 md:p-12">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="w-2 h-8 bg-gradient-to-b from-[#FFF6E0] to-transparent rounded-full mr-3"></span>
                    Contact Information
                  </h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-[#61677A]/20 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-[#61677A]/40 transition-colors duration-300">
                        <Mail className="h-5 w-5 text-[#D8D9DA]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#D8D9DA] mb-1">Email</p>
                        <a href="mailto:jatinjaglan347@gmail.com" className="text-[#FFF6E0] hover:text-[#D8D9DA] transition-colors group-hover:underline">
                          jatinjaglan347@gmail.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-[#61677A]/20 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-[#61677A]/40 transition-colors duration-300">
                        <RiTwitterXFill className="h-5 w-5 text-[#D8D9DA]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#D8D9DA] mb-1">Twitter</p>
                        <a href="https://x.com/Jatin_Jaglan347" target="_blank" rel="noopener noreferrer" className="text-[#FFF6E0] hover:text-[#D8D9DA] transition-colors group-hover:underline">
                          @Jatin_Jaglan347
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-[#61677A]/20 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-[#61677A]/40 transition-colors duration-300">
                        <Linkedin className="h-5 w-5 text-[#D8D9DA]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#D8D9DA] mb-1">LinkedIn</p>
                        <a href="https://www.linkedin.com/in/jatinjaglan" target="_blank" rel="noopener noreferrer" className="text-[#FFF6E0] hover:text-[#D8D9DA] transition-colors group-hover:underline">
                          linkedin.com/in/jatinjaglan
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-[#61677A]/20 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-[#61677A]/40 transition-colors duration-300">
                        <FaInstagram className="h-5 w-5 text-[#D8D9DA]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#D8D9DA] mb-1">Instagram</p>
                        <a href="https://instagram.com/jatinjaglan347" target="_blank" rel="noopener noreferrer" className="text-[#FFF6E0] hover:text-[#D8D9DA] transition-colors group-hover:underline">
                          @jatinjaglan347
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-[#61677A]/20">
                    <h4 className="text-lg font-medium mb-4 flex items-center">
                      <span className="w-1.5 h-6 bg-gradient-to-b from-[#FFF6E0] to-transparent rounded-full mr-2"></span>
                      Also Available For
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['Freelance Projects', 'Collaboration', 'Open Source', 'Speaking'].map((item, i) => (
                        <span 
                          key={i} 
                          className="bg-[#61677A]/20 px-3 py-1.5 rounded-lg text-sm border border-transparent hover:border-[#FFF6E0]/20 transition-colors duration-300 cursor-default"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Vertical divider for desktop */}
                <div className="hidden md:block absolute top-12 bottom-12 left-1/2 w-px bg-gradient-to-b from-[#FFF6E0]/5 via-[#FFF6E0]/20 to-[#FFF6E0]/5"></div>
                
                {/* Quick Message Form */}
                <div className="md:w-1/2 p-8 md:p-12 border-t md:border-t-0 border-[#61677A]/20 md:border-l">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="w-2 h-8 bg-gradient-to-b from-[#FFF6E0] to-transparent rounded-full mr-3"></span>
                    Quick Message
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        className="w-full bg-[#272829] border border-[#61677A]/30 rounded-lg p-3 pl-4 text-[#FFF6E0] placeholder:text-[#D8D9DA]/50 focus:outline-none focus:border-[#FFF6E0]/50 transition-all duration-300"
                        required
                      />
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#FFF6E0] to-transparent group-focus-within:w-full transition-all duration-500"></div>
                    </div>
                    
                    <div className="relative">
                      <input 
                        type="email" 
                        placeholder="Your Email" 
                        className="w-full bg-[#272829] border border-[#61677A]/30 rounded-lg p-3 pl-4 text-[#FFF6E0] placeholder:text-[#D8D9DA]/50 focus:outline-none focus:border-[#FFF6E0]/50 transition-all duration-300"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <textarea 
                        placeholder="Your Message" 
                        rows="5"
                        className="w-full bg-[#272829] border border-[#61677A]/30 rounded-lg p-3 pl-4 text-[#FFF6E0] placeholder:text-[#D8D9DA]/50 focus:outline-none focus:border-[#FFF6E0]/50 transition-all duration-300 resize-none"
                        required
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full relative overflow-hidden group bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] px-6 py-3 rounded-lg font-medium transition-all duration-500"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        Send Message
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
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