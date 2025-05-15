

  //  src="https://www.iconpacks.net/icons/2/free-handshake-icon-3312-thumb.png"
import React, {useRef, useState, useEffect } from 'react';
import 'animate.css';
import { Link } from 'react-router-dom';

function Home() {
  const [showOptions, setShowOptions] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);

  // Handle dark mode toggle
  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  // Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  // Smooth scroll to section
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  const testimonials = [
    {
      name: 'Priya, Mumbai',
      message: 'Thanks to We-Connect, I received help during the floods within an hour!',
    },
    {
      name: 'Rahul, Delhi',
      message: 'Volunteering with We-Connect has changed my life.',
    },
    {
      name: 'Ayesha, Bengaluru',
      message: 'I feel safer knowing someone is just a click away to help.',
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-blue-100 text-blue-900'} min-h-screen transition duration-300`}>
      {/* Navbar */}
      <div className="flex justify-between items-center p-4 shadow-md bg-white dark:bg-gray-800 sticky top-0 z-50">
        <Link to="/" className="text-2xl font-bold">
  We-Connect
</Link>

        <div className="space-x-4">
          <button onClick={() => scrollToSection('about')} className="hover:underline">About</button>
          <button onClick={() => scrollToSection('contact')} className="hover:underline">Contact</button>
          <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1 rounded bg-blue-600 text-white dark:bg-yellow-400">
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-4xl font-extrabold mb-3 animate__animated animate__fadeInDown">Welcome to the We-Connect App</h2>
        <p className="text-lg mb-5 animate__animated animate__fadeInUp">Join hands to make a difference. Volunteer today and be the change in your community!</p>
        <div className="relative inline-block mt-6" ref={dropdownRef}>
  <button
    onClick={() => setShowOptions((prev) => !prev)}
    className="bg-blue-600 text-white px-6 py-3 rounded-full text-xl font-semibold hover:bg-blue-700 transition transform hover:scale-105"
  >
    Get Started
  </button>

  {showOptions && (
    <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 bg-white border shadow-md rounded-lg z-50 w-44 text-center">
      <a
        href="/login"
        className="block px-4 py-2 text-blue-700 hover:bg-blue-100"
      >
        Login
      </a>
      <a
        href="/register"
        className="block px-4 py-2 text-blue-700 hover:bg-blue-100"
      >
        Register
      </a>
    </div>
  )}
</div>

      </div>

      {/* Emergency Contacts */}
<div className="p-6 text-center">
  <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
  <span className="text-red-500 py-2 transition-all duration-500 transform hover:scale-150 hover:-rotate-12 hover:text-green-600 cursor-pointer">
    📞
  </span>
  Emergency Contacts
</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    
    {/* Police */}
    <div className=" bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md hover:cursor-pointer flex items-center space-x-4 transform transition duration-500 hover:scale-105 hover:rotate-1 hover:shadow-xl hover:bg-red-50 dark:hover:bg-gray-600">
      <span className="text-red-500 text-2xl">🚓</span>
      <div>
        <p className="font-semibold " >Police</p>
        <p>100</p>
      </div>
    </div>

    {/* Ambulance */}
    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md hover:cursor-pointer flex items-center space-x-4 transform transition duration-500 hover:scale-105 hover:-rotate-1 hover:shadow-xl hover:bg-red-50 dark:hover:bg-gray-600">
      <span className="text-red-500 text-2xl">🚑</span>
      <div>
        <p className="font-semibold">Ambulance</p>
        <p>102 / 108</p>
      </div>
    </div>

    {/* Fire Brigade */}
    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md hover:cursor-pointer flex items-center space-x-4 transform transition duration-500 hover:scale-110 hover:rotate-2 hover:shadow-2xl hover:bg-red-50 dark:hover:bg-gray-600">
      <span className="text-red-500 text-2xl">🔥</span>
      <div>
        <p className="font-semibold">Fire Brigade</p>
        <p>101</p>
      </div>
    </div>
    
  </div>
</div>


      {/* Testimonial Slider */}
      <div className="bg-white dark:bg-gray-800 py-10 text-center">
        <h3 className="text-2xl font-bold mb-4">❤️ What People Say</h3>
        <blockquote className="italic max-w-xl mx-auto text-lg">
          “{testimonials[currentTestimonial].message}”
          <footer className="mt-2 text-sm font-medium">— {testimonials[currentTestimonial].name}</footer>
        </blockquote>
      </div>

      {/* About + Contact Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-10" id="about">
        <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-3">About Us</h3>
          <p>We-Connect is a platform that bridges people in need with volunteers who care. Whether it's an emergency or community support, we aim to provide help in time.</p>
        </div>
        <div id="contact" className="bg-blue-50 dark:bg-gray-700 p-6 rounded-xl shadow-md">
  <div className="flex flex-col md:flex-row md:justify-between gap-6">
    

    {/* Contact Block 1 */}
    <div>
      <h3 className="text-xl font-bold mb-3">Founder</h3>
      <p>Email: maitreyeedeshmukh08032004@gmail.com</p>
      <p>Phone: +91-85x7xx95x1</p>
      <p>Address: Pune, India</p>
    </div>
    {/* Contact Block 2 */}
    <div>
      <h3 className="text-xl font-bold mb-3">Co-Founder</h3>
      <p>Email: prathampatharkar12@gmail.com</p>
      <p>Phone: +91-7666xxx9x6</p>
      <p>Address: Pune, India</p>
    </div>
  </div>
</div>

      </div>

      {/* Floating Emergency FAB (Mobile) */}
      <button
        className="fixed bottom-5 right-5 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition lg:hidden z-50"
        onClick={() => scrollToSection('emergency')}
        title="Emergency Contacts"
      >
        🚨
      </button>
    </div>
  );
}

export default Home;
