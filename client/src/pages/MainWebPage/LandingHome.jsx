import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jatinjatinimg from "../../assets/images/JatinJaglanImg.jpeg";
import {
  MapPin,
  Shield,
  MessageSquare,
  Users,
  ChevronRight,
  Radio,
  Lock,
  Zap,
  Star,
  ArrowRight,
  Smartphone,
  BellRing,
  AlertCircle,
  X,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

function LandingHome() {
  const { authUser } = useAuthStore();
  const [seed, setSeed] = useState();
  const [newsLetterEmail, setNewsLetterEmail] = useState({
    email: "",
    ifExistingUser: false,
  });

  useEffect(() => {
    setSeed(Math.random() * 100);
  }, []);
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out",
      once: true,
      offset: 100,
    });

    // Parallax effect on scroll
    const handleScroll = () => {
      const parallaxElements = document.querySelectorAll(".parallax");
      parallaxElements.forEach((element) => {
        const speed = element.getAttribute("data-speed") || 0.5;
        const yPos = -(window.scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  window.scrollTo(0, 0);
  useEffect(() => {
    if (authUser?.data?.user) {
      setNewsLetterEmail((prevState) => ({
        ...prevState,
        email: authUser.data.user.email,
        ifExistingUser: true,
      }));
    }
  }, [authUser, setNewsLetterEmail]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Show professional toast notification with immediate dismissal
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-gradient-to-r from-[#272829] to-[#2F3237] shadow-xl rounded-lg pointer-events-auto flex overflow-hidden`}
        >
          <div className="flex-1 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-white">Coming Soon</p>
                <p className="mt-1 text-xs text-gray-300">
                  We're working on this feature. Thank you for your interest.
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => {
                    // Force immediate dismissal
                    toast.remove(t.id);
                  }}
                  className="bg-transparent text-gray-400 hover:text-white focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="w-1 bg-[#545968]"></div>
        </div>
      ),
      {
        duration: 2000,
        position: "top-center",
      }
    );
  };

  return (
    <div className="bg-[#272829] text-[#FFF6E0] overflow-hidden">
      {/* <LandingNavbar /> */}

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Dynamic background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#272829] opacity-80"></div>
          {/* City background with subtle blur for hero section */}
          <div className="absolute inset-0 bg-[url('/src/assets/images/city-background.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#272829] via-[#31333A] to-transparent opacity-90"></div>
        </div>

        {/* Animated floating orbs */}
        <div
          className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-30 animate-pulse"
          style={{ animationDuration: "7s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-20 animate-pulse"
          style={{ animationDuration: "10s" }}
        ></div>
        <div
          className="absolute top-40 left-1/4 w-40 h-40 rounded-full bg-[#FFF6E0] blur-[80px] opacity-10 animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, #FFF6E0 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="flex flex-col md:flex-row items-center">
            <div
              className="md:w-1/2 md:pr-8 mb-16 md:mb-0"
              data-aos="fade-right"
            >
              <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full mb-6">
                <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium">
                  Version 1 Beta
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                Connect with people{" "}
                <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
                  nearby
                </span>
              </h1>

              <p className="text-xl mb-8 text-[#D8D9DA] max-w-lg leading-relaxed">
                RadialWhisper lets you chat anonymously with people within your
                custom radius. Adjust your connection range and discover meaningful interactions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="group relative overflow-hidden btn bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <span className="relative z-10">Join Beta</span>
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </Link>

                <Link
                  to="/about"
                  className="btn btn-outline text-[#FFF6E0] border-[#FFF6E0] hover:bg-[#FFF6E0] hover:text-[#272829] hover:border-[#FFF6E0] px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-md"
                >
                  Learn More
                </Link>
              </div>

              {/* Remove user stats */}
              <div className="mt-12 px-5 py-4 bg-gradient-to-r from-[#31333A]/80 to-[#31333A]/20 backdrop-blur-sm rounded-lg border border-[#61677A]/30">
                <p className="text-[#FFF6E0] font-medium">
                  <span className="text-[#D8D9DA]">🚀</span> RadialWhisper Beta is now live! Be among the first to experience location-based anonymous networking.
                </p>
              </div>
            </div>

            <div
              className="md:w-1/2 relative"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="relative">
                {/* Glow effect behind phone */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#61677A] to-[#D8D9DA] rounded-2xl opacity-30 blur-xl transform translate-x-2 translate-y-2"></div>

                {/* Phone mockup with app interface */}
                <div className="relative overflow-hidden rounded-2xl border border-[#61677A]/30 shadow-2xl">
                  <img
                    src="/src/assets/images/app-interface-map.jpg"
                    alt="RadialWhisper App Interface"
                    className="w-full h-auto rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#272829] to-transparent opacity-40"></div>
                </div>

                {/* Floating UI elements */}
                <div
                  className="absolute -top-8 -right-4 bg-[#FFF6E0] text-[#272829] p-4 rounded-lg shadow-lg transform rotate-6 animate-pulse"
                  style={{ animationDuration: "3s" }}
                >
                  <p className="text-sm font-medium">Hey there!</p>
                </div>
                <div
                  className="absolute -bottom-5 -left-5 bg-[#61677A] text-[#FFF6E0] p-4 rounded-lg shadow-lg transform -rotate-3 animate-pulse"
                  style={{ animationDuration: "4s" }}
                >
                  <p className="text-sm font-medium">Anyone at the concert?</p>
                </div>

                {/* Animated notification */}
                <div
                  className="absolute top-1/4 right-0 transform translate-x-1/2 bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] p-3 rounded-full shadow-lg flex items-center justify-center animate-bounce"
                  style={{ animationDuration: "2s" }}
                >
                  <BellRing size={24} />
                </div>

                {/* Status indicators */}
                <div className="absolute bottom-12 right-8 flex items-center gap-2 bg-[#272829]/80 backdrop-blur-sm px-3 py-1 rounded-full border border-[#61677A]/50">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-xs text-[#FFF6E0]">
                    15 users nearby
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curved wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-20 md:h-32"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,96,0,64V56.44Z"
              fill="#61677A"
            ></path>
          </svg>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-b from-[#61677A] to-[#4d525f] py-24 md:py-32 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, #FFF6E0 1px, transparent 1px), linear-gradient(to bottom, #FFF6E0 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20" data-aos="fade-up">
            <span className="bg-[#272829]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              How RadialWhisper Works
            </h2>
            <p className="text-xl max-w-3xl mx-auto text-[#FFF6E0]/90">
              Connect with people nearby in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div
              className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-10px] group"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] w-16 h-16 flex items-center justify-center rounded-full mb-8 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div className="flex justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Radio size={56} className="text-[#FFF6E0]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">
                Set Your Radius
              </h3>
              <p className="text-center text-[#D8D9DA] leading-relaxed">
                Adjust your location radius to determine how far your chat reach
                extends. You control your connections.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-10px] group"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] w-16 h-16 flex items-center justify-center rounded-full mb-8 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <div className="flex justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Users size={56} className="text-[#FFF6E0]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">
                Discover People
              </h3>
              <p className="text-center text-[#D8D9DA] leading-relaxed">
                Find others within your radius. View only their profile picture,
                gender, and bio.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-10px] group"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] w-16 h-16 flex items-center justify-center rounded-full mb-8 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <div className="flex justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare size={56} className="text-[#FFF6E0]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">
                Start Chatting
              </h3>
              <p className="text-center text-[#D8D9DA] leading-relaxed">
                Connect anonymously with people nearby without sharing personal
                details. Build real connections.
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center mt-16" data-aos="fade-up">
            <Link
              to="/how-it-works"
              className="inline-flex items-center text-lg font-medium text-[#FFF6E0] hover:text-[#D8D9DA] transition-colors"
            >
              Learn more about how it works
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Diagonal divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden transform scale-y-[-1]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-20 md:h-32"
          >
            <path d="M1200 120L0 16.48V0h1200v120z" fill="#272829"></path>
          </svg>
        </div>
      </div>

      {/* App Preview Section */}
      <div className="py-24 md:py-36 relative overflow-hidden">
        {/* Background elements */}
        <div
          className="absolute top-40 left-0 w-96 h-96 rounded-full bg-[#61677A] blur-[150px] opacity-20 parallax "
          data-speed="0.3"
        ></div>
        <div
          className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-10 parallax"
          data-speed="0.2"
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div
              className="md:w-1/2 mb-16 md:mb-0 relative"
              data-aos="fade-right"
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#61677A] to-[#D8D9DA] rounded-lg opacity-30 blur-xl transform -translate-x-2 translate-y-2"></div>

                {/* First phone */}
                <div className="relative md:absolute md:transform md:rotate-6 md:translate-x-8 md:z-10 rounded-2xl border border-[#61677A]/30 shadow-2xl transition-all duration-500 hover:rotate-0 hover:scale-105">
                  <img
                    src="/src/assets/images/app-screen-chat.jpg"
                    alt="RadialWhisper Mobile App"
                    className="w-full h-auto rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#272829] to-transparent opacity-40 rounded-2xl"></div>

                  {/* UI elements */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-[#FFF6E0]/10 backdrop-blur-md px-4 py-2 rounded-full border border-[#FFF6E0]/30">
                    <p className="text-sm text-[#FFF6E0] font-medium">
                      5 people within 100m
                    </p>
                  </div>
                </div>

                {/* Second phone */}
                <div className="hidden md:block absolute top-8 -left-12 transform -rotate-6 rounded-2xl border border-[#61677A]/30 shadow-2xl transition-all duration-500 hover:rotate-0 hover:scale-105">
                  <img
                    src="/src/assets/images/app-screen-profile.jpg"
                    alt="RadialWhisper Mobile App Alternative View"
                    className="w-full h-auto rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#272829] to-transparent opacity-40 rounded-2xl"></div>

                  {/* Chat UI element */}
                  <div className="absolute bottom-16 inset-x-4 bg-[#272829]/80 backdrop-blur-md p-3 rounded-xl border border-[#61677A]/30">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#61677A] flex-shrink-0 overflow-hidden">
                        <img
                          src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed}`}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="bg-[#61677A]/50 px-3 py-2 rounded-lg max-w-[80%]">
                        <p className="text-sm text-[#FFF6E0]">
                          Hey! Are you at the north entrance?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="md:w-1/2 md:pl-16"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                Proximity Chat
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
                  Proximity-based
                </span>{" "}
                communication
              </h2>
              <p className="text-lg mb-8 text-[#D8D9DA] leading-relaxed">
                RadialWhisper revolutionizes how we connect with people around
                us. Whether you're at a concert, coffee shop, or college campus,
                discover and chat with people nearby.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 bg-gradient-to-br from-[#61677A] to-[#4d525f] p-4 rounded-xl shadow-lg">
                    <MapPin className="h-6 w-6 text-[#FFF6E0]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Location-Based Discovery
                    </h3>
                    <p className="text-[#D8D9DA] leading-relaxed">
                      See and connect with users within your customizable
                      radius. You control how far your reach extends.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 bg-gradient-to-br from-[#61677A] to-[#4d525f] p-4 rounded-xl shadow-lg">
                    <Shield className="h-6 w-6 text-[#FFF6E0]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Privacy Protected
                    </h3>
                    <p className="text-[#D8D9DA] leading-relaxed">
                      Your personal information stays private. Only your profile
                      picture, gender, and bio are visible to others.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 bg-gradient-to-br from-[#61677A] to-[#4d525f] p-4 rounded-xl shadow-lg">
                    <Zap className="h-6 w-6 text-[#FFF6E0]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Real-Time Updates
                    </h3>
                    <p className="text-[#D8D9DA] leading-relaxed">
                      As people enter or leave your radius, your available
                      connections update instantly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <Link
                  to="/features"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-[#61677A]/30 hover:bg-[#61677A]/50 text-[#FFF6E0] font-medium transition-all duration-300 border border-[#FFF6E0]/20 hover:border-[#FFF6E0]/40"
                >
                  Explore all features
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-gradient-to-b from-[#31333A] to-[#272829] py-24 md:py-36 relative">
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-20 md:h-32"
          >
            <path d="M1200 0L0 60V0h1200z" fill="#272829"></path>
          </svg>
        </div>

        {/* Background patterns */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, #FFF6E0 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
          <div className="text-center mb-20" data-aos="fade-up">
            <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
              Key Features
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Why Choose RadialWhisper?
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-[#D8D9DA]">
              Our unique features make connecting with people nearby safe and
              fun
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div
              className="flex flex-col md:flex-row gap-8 group"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-[#61677A] to-[#4d525f] w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Radio size={40} className="text-[#FFF6E0]" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Customizable Radius</h3>
                <p className="text-[#D8D9DA] leading-relaxed">
                  Adjust your chat radius to connect with people at your
                  preferred distance - from a few meters to several kilometers.
                  Perfect for both intimate gatherings and larger events.
                </p>
              </div>
            </div>

            <div
              className="flex flex-col md:flex-row gap-8 group"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-[#61677A] to-[#4d525f] w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Lock size={40} className="text-[#FFF6E0]" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Privacy Protection</h3>
                <p className="text-[#D8D9DA] leading-relaxed">
                  Chat anonymously without revealing personal details. Only
                  share what you're comfortable with. Your exact location is
                  never shared with other users.
                </p>
              </div>
            </div>

            <div
              className="flex flex-col md:flex-row gap-8 group"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-[#61677A] to-[#4d525f] w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare size={40} className="text-[#FFF6E0]" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Real-time Chat</h3>
                <p className="text-[#D8D9DA] leading-relaxed">
                  Enjoy seamless, instant messaging with people in your
                  vicinity. Connect immediately as they enter your radius with
                  instant notifications and smooth messaging.
                </p>
              </div>
            </div>

            <div
              className="flex flex-col md:flex-row gap-8 group"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-[#61677A] to-[#4d525f] w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users size={40} className="text-[#FFF6E0]" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Meet New People</h3>
                <p className="text-[#D8D9DA] leading-relaxed">
                  Discover new connections based on proximity. Perfect for
                  making friends in a new area or at events. Find people with
                  similar interests through our optional interest matching.
                </p>
              </div>
            </div>
          </div>

          {/* Feature showcase */}
          <div
            className="mt-24 p-6 md:p-10 bg-gradient-to-br from-[#272829] to-[#31333A] rounded-2xl border border-[#61677A]/30 shadow-2xl relative overflow-hidden"
            data-aos="fade-up"
          >
            {/* Background shapes */}
            <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-[#61677A]/10 blur-lg"></div>
            <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-[#FFF6E0]/5 blur-xl"></div>

            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="md:w-1/2">
                <span className="bg-[#FFF6E0]/10 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                  Featured
                </span>
                <h3 className="text-3xl font-bold mb-6">
                  Exclusive Premium Features
                </h3>
                <p className="text-[#D8D9DA] mb-8 leading-relaxed">
                  Upgrade to RadialWhisper Premium to unlock advanced features
                  for even better connections.
                </p>

                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] w-6 h-6 rounded-full flex items-center justify-center">
                      <Star size={12} className="text-[#272829]" />
                    </div>
                    <span className="text-[#FFF6E0]">
                      Extended radius options up to 5km
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] w-6 h-6 rounded-full flex items-center justify-center">
                      <Star size={12} className="text-[#272829]" />
                    </div>
                    <span className="text-[#FFF6E0]">
                      Advanced profile customization
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] w-6 h-6 rounded-full flex items-center justify-center">
                      <Star size={12} className="text-[#272829]" />
                    </div>
                    <span className="text-[#FFF6E0]">
                      Create and join interest-based groups
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] w-6 h-6 rounded-full flex items-center justify-center">
                      <Star size={12} className="text-[#272829]" />
                    </div>
                    <span className="text-[#FFF6E0]">Ad-free experience</span>
                  </li>
                </ul>

                <div className="mt-8">
                  <Link
                    to="/premium"
                    className="btn bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] px-6 py-3 rounded-full font-medium transition-all duration-300 inline-flex items-center"
                  >
                    Get Premium
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>

              <div className="md:w-1/2 relative">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFF6E0]/30 to-[#D8D9DA]/30 rounded-lg opacity-30 blur-xl transform translate-x-2 translate-y-2"></div>

                  {/* Phone mockup */}
                  <div className="relative rounded-2xl border border-[#61677A]/30 shadow-2xl overflow-hidden">
                    <img
                      src="/api/placeholder/500/300"
                      alt="RadialWhisper Premium Features"
                      className="w-full h-auto rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#272829] to-transparent opacity-40"></div>

                    {/* Premium badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      PREMIUM
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 md:py-32 relative">
        {/* Background elements */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#61677A] blur-[150px] opacity-10 parallax"
          data-speed="0.2"
        ></div>
        <div
          className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-10 parallax"
          data-speed="0.3"
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20" data-aos="fade-up">
            <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
              Potential Use Cases
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Designed for Real-World Connections
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-[#D8D9DA]">
              Here's how RadialWhisper can enhance your social experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Use Case 1 */}
            <div
              className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl border border-[#61677A]/30 shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-5px]"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="bg-[#61677A]/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-[#FFF6E0]" />
              </div>
              <h4 className="text-xl font-bold mb-4">Coffee Shop Networking</h4>
              <p className="text-[#D8D9DA] leading-relaxed">
                Connect with others working or relaxing in the same coffee shop. Find potential collaborators, friends, or just enjoy a conversation with someone new.
              </p>
            </div>

            {/* Use Case 2 */}
            <div
              className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl border border-[#61677A]/30 shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-5px]"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="bg-[#61677A]/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-[#FFF6E0]" />
              </div>
              <h4 className="text-xl font-bold mb-4">Events & Festivals</h4>
              <p className="text-[#D8D9DA] leading-relaxed">
                Find others attending the same concert, conference, or festival. Make new connections with people who share your interests and enhance your event experience.
              </p>
            </div>

            {/* Use Case 3 */}
            <div
              className="bg-gradient-to-br from-[#272829] to-[#31333A] p-8 rounded-xl border border-[#61677A]/30 shadow-xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-5px]"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="bg-[#61677A]/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <MessageSquare className="h-8 w-8 text-[#FFF6E0]" />
              </div>
              <h4 className="text-xl font-bold mb-4">Campus Connections</h4>
              <p className="text-[#D8D9DA] leading-relaxed">
                Meet fellow students on your campus. From study partners to club members, expand your university network beyond your immediate social circle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download CTA */}
      <div className="bg-gradient-to-br from-[#61677A] to-[#4d525f] py-20 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, #FFF6E0 1px, transparent 1px), linear-gradient(to bottom, #FFF6E0 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="md:w-1/2" data-aos="fade-right">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Join the RadialWhisper Beta
              </h2>
              <p className="text-xl mb-8 text-[#FFF6E0]/90 leading-relaxed">
                We're launching our web-based Beta version. Be among the first to experience 
                proximity-based connections and help shape the future of RadialWhisper.
              </p>

              <div className="bg-[#272829]/40 backdrop-blur-sm rounded-xl p-6 border border-[#FFF6E0]/10 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#FFF6E0]/10 p-2 rounded-full">
                    <BellRing className="h-5 w-5 text-[#FFF6E0]" />
                  </div>
                  <h3 className="font-semibold">Beta Features</h3>
                </div>
                <ul className="space-y-2 text-[#D8D9DA]">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFF6E0]"></div>
                    <span>Web-based platform (no app download required)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFF6E0]"></div>
                    <span>Location-based anonymous chatting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFF6E0]"></div>
                    <span>Customizable discovery radius</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/signup"
                className="btn bg-[#272829] hover:bg-[#31333A] text-[#FFF6E0] px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <span>Get Beta Access</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="md:w-1/2 flex justify-center" data-aos="fade-left">
              <div className="relative">
                {/* Animated radar effect */}
                <div className="relative w-72 h-72 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-[#FFF6E0]/10 animate-ping" style={{animationDuration: '2s'}}></div>
                  <div className="absolute inset-0 scale-75 rounded-full border-2 border-[#FFF6E0]/20 animate-ping" style={{animationDuration: '3s'}}></div>
                  <div className="absolute inset-0 scale-50 rounded-full border-2 border-[#FFF6E0]/30 animate-ping" style={{animationDuration: '4s'}}></div>
                  
                  <div className="w-20 h-20 rounded-full bg-[#272829] border-2 border-[#FFF6E0]/30 flex items-center justify-center z-10">
                    <Radio className="h-10 w-10 text-[#FFF6E0]" />
                  </div>
                  
                  {/* Dots representing users */}
                  <div className="absolute top-1/4 right-1/4 w-6 h-6 rounded-full bg-[#FFF6E0]/80 animate-pulse"></div>
                  <div className="absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full bg-[#FFF6E0]/60 animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/5 w-5 h-5 rounded-full bg-[#FFF6E0]/70 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Move and redesign The Mind Behind RadialWhisper section - improved design */}
      <div className="py-24 bg-gradient-to-br from-[#272829] to-[#31333A] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, #FFF6E0 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>
        
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-[#61677A] blur-[150px] opacity-15 animate-pulse" style={{animationDuration: '10s'}}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#FFF6E0] blur-[150px] opacity-5 animate-pulse" style={{animationDuration: '15s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            {/* Left: Visual element and creator intro */}
            <div className="lg:w-5/12" data-aos="fade-right">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute w-full h-full bg-gradient-to-br from-[#61677A]/20 to-[#D8D9DA]/5 blur-3xl rounded-full transform scale-150 -translate-x-10 translate-y-10"></div>
                
                <div className="bg-gradient-to-br from-[#31333A] to-[#272829] rounded-2xl p-10 border border-[#61677A]/30 shadow-xl relative overflow-hidden backdrop-blur-sm">
                  <div className="absolute -top-28 -right-28 w-56 h-56 rounded-full bg-[#61677A]/10 blur-lg"></div>
                  
                  <div className="flex flex-col items-center text-center relative z-10">
                    <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-6">
                      Meet the Creator
                    </span>
                    
                    <div className="group relative w-36 h-36 mb-8">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] opacity-50 blur-md group-hover:opacity-70 transition-opacity"></div>
                      <div className="absolute inset-1 rounded-full border-2 border-[#FFF6E0]/20 overflow-hidden bg-[#31333A]">
                        <img
                          src={jatinjatinimg}
                          alt="Jatin Jaglan"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] rounded-full flex items-center justify-center border-2 border-[#272829] shadow-lg">
                        <Radio className="h-5 w-5 text-[#272829]" />
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-[#FFF6E0] mb-2">Jatin Jaglan</h3>
                    <p className="text-[#D8D9DA] mb-6">Creator & Full-Stack Developer</p>
                    
                    <div className="flex justify-center space-x-4 mb-8">
                      <a
                        href="https://github.com/JatinJaglan347"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-[#61677A]/30 hover:bg-[#61677A]/50 transition-colors duration-200 hover:scale-110 transform group"
                      >
                        <Github className="h-5 w-5 text-[#FFF6E0] group-hover:text-white" />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/jatinjaglan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-[#61677A]/30 hover:bg-[#61677A]/50 transition-colors duration-200 hover:scale-110 transform group"
                      >
                        <Linkedin className="h-5 w-5 text-[#FFF6E0] group-hover:text-white" />
                      </a>
                      <a
                        href="https://x.com/Jatin_Jaglan347"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-[#61677A]/30 hover:bg-[#61677A]/50 transition-colors duration-200 hover:scale-110 transform group"
                      >
                        <Twitter className="h-5 w-5 text-[#FFF6E0] group-hover:text-white" />
                      </a>
                    </div>
                    
                    <Link
                      to="/anonymous"
                      className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] px-8 py-4 font-medium transition-all duration-300 flex items-center justify-center shadow-lg w-full"
                    >
                      <span className="relative z-10">Meet the Mind Behind RadialWhisper</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Story and vision */}
            <div className="lg:w-7/12" data-aos="fade-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                The Vision Behind <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">RadialWhisper</span>
              </h2>
              
              <p className="text-xl text-[#D8D9DA] mb-10 leading-relaxed">
                "I believe technology should enhance human connections, not replace them. RadialWhisper was born from the desire to use technology to help people connect in the physical world."
              </p>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-[#31333A] to-[#272829]/80 rounded-xl p-6 border border-[#61677A]/30 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <div className="bg-[#FFF6E0]/10 p-2 rounded-full">
                      <Zap className="h-5 w-5 text-[#FFF6E0]" />
                    </div>
                    <span>The Spark</span>
                  </h3>
                  <p className="text-[#D8D9DA] leading-relaxed">
                    RadialWhisper began as a solution to a problem I experienced firsthand. While sitting in a crowded university library, I was surrounded by people yet felt completely disconnected. I wondered: what if technology could help bridge this gap instead of widening it?
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-[#31333A] to-[#272829]/80 rounded-xl p-6 border border-[#61677A]/30 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <div className="bg-[#FFF6E0]/10 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-[#FFF6E0]" />
                    </div>
                    <span>Core Values</span>
                  </h3>
                  <p className="text-[#D8D9DA] leading-relaxed">
                    The platform is built on three core principles: privacy-first design, genuine human connection, and digital tools that enhance real-world interactions rather than replacing them.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-[#31333A] to-[#272829]/80 rounded-xl p-6 border border-[#61677A]/30 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <div className="bg-[#FFF6E0]/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-[#FFF6E0]" />
                    </div>
                    <span>The Journey</span>
                  </h3>
                  <p className="text-[#D8D9DA] leading-relaxed">
                    Developing RadialWhisper has been a labor of love and learning. From concept to Beta, every feature has been carefully crafted with the user's experience and safety in mind. This Beta launch represents the first step in what I hope will be a technology that meaningfully improves how we connect with each other.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Replace FAQ Section with Community Section */}
      <div className="py-24 md:py-32 relative">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, #FFF6E0 1px, transparent 1px), linear-gradient(to bottom, #FFF6E0 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
        
        <div className="absolute top-1/3 left-0 w-80 h-80 rounded-full bg-[#61677A] blur-[100px] opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#FFF6E0] blur-[80px] opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="bg-[#61677A]/30 text-[#FFF6E0] px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
              Community
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Join Our Growing Community
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-[#D8D9DA]">
              Be part of shaping the future of proximity-based social networking
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-aos="fade-up">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] rounded-xl border border-[#61677A]/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <div className="h-24 bg-gradient-to-r from-[#61677A] to-[#4d525f] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFF6E0]/10 to-transparent opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BellRing className="h-12 w-12 text-[#FFF6E0] group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-[#FFF6E0]">Beta Tester Program</h3>
                <p className="text-[#D8D9DA] leading-relaxed mb-6">
                  Join our exclusive beta testing program to get early access to new features and help shape the future of RadialWhisper with your feedback.
                </p>
                <Link
                  to="/signup?beta=true"
                  className="inline-flex items-center text-[#FFF6E0] hover:text-[#D8D9DA] transition-colors"
                >
                  <span>Apply to join</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] rounded-xl border border-[#61677A]/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <div className="h-24 bg-gradient-to-r from-[#61677A] to-[#4d525f] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFF6E0]/10 to-transparent opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageSquare className="h-12 w-12 text-[#FFF6E0] group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-[#FFF6E0]">Community Forums</h3>
                <p className="text-[#D8D9DA] leading-relaxed mb-6">
                  Connect with other users, share your experiences, suggest new features, and discuss how RadialWhisper has enhanced your social interactions.
                </p>
                <Link
                  to="/community"
                  className="inline-flex items-center text-[#FFF6E0] hover:text-[#D8D9DA] transition-colors"
                >
                  <span>Visit forums</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="bg-gradient-to-br from-[#272829] to-[#31333A] rounded-xl border border-[#61677A]/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <div className="h-24 bg-gradient-to-r from-[#61677A] to-[#4d525f] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFF6E0]/10 to-transparent opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Github className="h-12 w-12 text-[#FFF6E0] group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-[#FFF6E0]">Open Source Journey</h3>
                <p className="text-[#D8D9DA] leading-relaxed mb-6">
                  Follow our development journey, contribute ideas, or explore how we're building RadialWhisper with a focus on privacy and genuine connections.
                </p>
                <a
                  href="https://github.com/JatinJaglan347"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#FFF6E0] hover:text-[#D8D9DA] transition-colors"
                >
                  <span>View GitHub</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
          
          {/* CTA Banner */}
          <div className="mt-16 bg-gradient-to-r from-[#31333A] to-[#272829] rounded-xl p-8 border border-[#61677A]/30 shadow-lg" data-aos="fade-up">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-[#FFF6E0]">Have ideas to improve RadialWhisper?</h3>
                <p className="text-[#D8D9DA]">We'd love to hear your thoughts on enhancing the platform.</p>
              </div>
              <Link
                to="/suggestion"
                className="btn bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center whitespace-nowrap"
              >
                Share Your Ideas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-[#272829] to-[#31333A] py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            className="bg-gradient-to-br from-[#61677A] to-[#4d525f] p-8 md:p-12 rounded-2xl shadow-2xl border border-[#FFF6E0]/10 relative overflow-hidden"
            data-aos="fade-up"
          >
            {/* Background elements */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#FFF6E0]/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#FFF6E0]/5 blur-3xl"></div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Stay Connected
                </h2>
                <p className="text-lg text-[#FFF6E0]/90 max-w-2xl mx-auto">
                  Subscribe to our newsletter for updates, tips on making the
                  most of RadialWhisper, and exclusive offers.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    id="email"
                    value={newsLetterEmail.email}
                    onChange={(e) => setNewsLetterEmail(e.target.value)}
                    required
                    disabled={newsLetterEmail.ifExistingUser}
                    placeholder="Enter your email"
                    className={`flex-grow px-6 py-4 rounded-full bg-[#272829]/80 text-[#FFF6E0] border border-[#FFF6E0]/20 focus:border-[#FFF6E0]/50 focus:outline-none ${
                      newsLetterEmail.ifExistingUser
                        ? "cursor-not-allowed opacity-50 "
                        : ""
                    }`}
                  />
                  <button
                    type="submit"
                    className="btn bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-sm text-[#FFF6E0]/70 text-center mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingHome;
