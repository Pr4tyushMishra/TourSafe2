import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import travelImg from "../assets/travel.jpg";

const testimonials = [
  {
    name: "Emily Smith",
    title: "Traveler",
    quote: "TourSafe kept me informed and safe during my solo trip!",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "John & Lisa",
    title: "Adventure Enthusiasts",
    quote: "We felt secure knowing help was just a tap away.",
    img: "https://randomuser.me/api/portraits/men/56.jpg",
  },
  {
    name: "Mark Johnson",
    title: "Backpacker",
    quote: "Absolutely essential for any traveler!",
    img: "https://randomuser.me/api/portraits/men/17.jpg",
  },
];

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle register button click
  const handleRegisterClick = () => {
    navigate('/auth');
  };

  return (
    <div className="font-sans bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-5 bg-white shadow-md border-b border-blue-200 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <span className="font-extrabold text-2xl text-blue-700 flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 21c-4.337-3.488-6.5-7.22-6.5-10.053C5.5 6.3 8.818 3 12 3s6.5 3.3 6.5 7.947C18.5 13.78 16.337 17.512 12 21z" />
            </svg>
            TourSafe
          </span>
        </div>
        <div className="flex items-center space-x-10 text-lg text-blue-700 font-semibold">
          <Link
            to="/demo"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition transform hover:scale-110 shadow-md"
          >
            🎬 Demo Mode
          </Link>
          <Link
            to="/monitoring-dashboard"
            className="hover:text-blue-900 transition transform hover:scale-110"
          >
            Monitoring Dashboard
          </Link>
          <Link
            to="/emergency-response"
            className="hover:text-red-600 transition transform hover:scale-110"
          >
            Emergency Response
          </Link>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none rounded-full focus:ring-2 focus:ring-blue-500"
              aria-label="User menu"
            >
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                alt="User profile"
                className="h-12 w-12 rounded-full border-2 border-blue-400 hover:border-blue-700 cursor-pointer transition"
              />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl py-2 z-50 border border-blue-200 animate-fadeIn">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition"
                >
                  View Profile
                </Link>
                <div className="border-t border-blue-100 my-2"></div>
                <Link
                  to="/signout"
                  className="block px-4 py-2 text-red-600 hover:bg-red-100 hover:text-red-800 transition"
                >
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section>
        <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden relative rounded-b-3xl shadow-lg max-w-7xl mx-auto">
          <img
            src={travelImg}
            alt="Tourists viewing landscape"
            className="w-full h-full object-cover object-center filter brightness-90 transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30 rounded-b-3xl pointer-events-none" />
        </div>
        <div className="text-center py-12 px-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 drop-shadow-lg">
            Welcome to TourSafe
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Ensuring a safe and enjoyable travel experience for everyone,
            everywhere.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-blue-800 tracking-wide">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-12">
          {[{
            icon: (
              <svg
                className="w-10 h-10 mx-auto text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l1.5 4.5H18l-3 2.5L16.5 14l-4.5-3-4.5 3L9 9l-3-2.5h4.5L12 2z" />
              </svg>
            ),
            title: "Plan Your Trip",
            description:
              "Select your destination and get tailored safety information.",
          },
          {
            icon: (
              <svg
                className="w-10 h-10 mx-auto text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M17 19H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z" />
              </svg>
            ),
            title: "Stay Informed",
            description:
              "Receive real-time alerts and updates for your location.",
          },
          {
            icon: (
              <svg
                className="w-10 h-10 mx-auto text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              </svg>
            ),
            title: "Get Help",
            description:
              "Access emergency services and support instantly.",
          }].map(({ icon, title, description }, i) => (
            <div
              key={i}
              className="flex flex-col items-center w-full md:w-1/3 text-center space-y-3 px-4"
            >
              <span>{icon}</span>
              <h3 className="font-semibold text-xl text-blue-800">{title}</h3>
              <p className="text-gray-600 text-sm max-w-xs">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-blue-50 py-12 max-w-7xl mx-auto px-6 rounded-xl shadow-inner">
        <h2 className="text-3xl font-bold text-center mb-10 text-blue-900">
          Key Features
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {[{
            icon: (
              <svg 
                className="w-10 h-10 mx-auto text-blue-700" 
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path d="M12 2C7.03 2 2 7.33 2 12c0 4.67 5.03 10 10 10s10-5.33 10-10c0-4.67-5.03-10-10-10zm0 18c-3.31 0-8-4.03-8-8 0-3.97 4.69-8 8-8s8 4.03 8 8c0 3.97-4.69 8-8 8zm0-10v2m0 4h.01"></path>
              </svg>
            ),
            title: "Safety Alerts",
            description:
              "Timely notifications about safety risks in your area.",
          },
          {
            icon: (
              <svg 
                className="w-10 h-10 mx-auto text-blue-700" 
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path d="M21 10a9 9 0 01-18 0c0-4.97 4.03-9 9-9s9 4.03 9 9zm-4 2a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            ),
            title: "Emergency Contacts",
            description:
              "Quick access to local emergency numbers.",
          },
          {
            icon: (
              <svg 
                className="w-10 h-10 mx-auto text-blue-700" 
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 7.477 2 13s4.477 11 10 11 10-4.477 10-10S17.523 2 12 2zm0 19a9.001 9.001 0 01-8.337-5.028C4.55 11.881 7.975 8.858 12 8.858s7.45 3.023 8.337 7.114A9.001 9.001 0 0112 21z"></path>
              </svg>
            ),
            title: "Global Coverage",
            description:
              "Information and support available worldwide.",
          }].map(({ icon, title, description }, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md flex-1 px-8 py-8 flex flex-col items-center transform hover:scale-105 transition"
            >
              <span className="mb-4">{icon}</span>
              <h4 className="font-semibold text-xl text-blue-800 mb-2">{title}</h4>
              <p className="text-gray-600 text-center">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center mb-10 text-blue-900">
          Testimonials
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-10">
          {testimonials.map(({ name, title, quote, img }, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center w-full md:w-1/4 text-center bg-blue-50 rounded-xl shadow-md p-6"
            >
              <img
                src={img}
                alt={name}
                className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-blue-300"
              />
              <p className="italic text-blue-900 mb-3">"{quote}"</p>
              <span className="font-semibold text-blue-800">{name}</span>
              <span className="text-blue-600 text-sm">{title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <footer className="bg-blue-900 py-16 mt-12">
        <div className="text-center max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-6 tracking-wide">
            Join TourSafe Today
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            Sign up now and travel with peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleRegisterClick}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-12 py-4 rounded-full shadow-lg hover:shadow-cyan-400 transition transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-cyan-400"
            >
              Register Now
            </button>
            <Link
              to="/demo"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-orange-400 transition transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-orange-400"
            >
              🎬 Try Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
