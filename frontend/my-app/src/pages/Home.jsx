import React, { useState } from 'react';
function Home() {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="bg-blue-100 min-h-screen flex items-center justify-center relative">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto p-6 z-20 relative">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-4 animate__animated animate__fadeIn animate__delay-1s">
          Welcome to the We-Connect App
        </h1>
        <p className="text-lg text-blue-700 mb-6 animate__animated animate__fadeIn animate__delay-2s">
          Join hands to make a difference. Volunteer today and be the change in your community!
        </p>

        {/* Get Started Button with Dropdown */}
        <div className="relative inline-block">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="bg-blue-600 text-white px-6 py-3 rounded-full text-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 animate__animated animate__zoomIn animate__delay-3s"
          >
            Get Started
          </button>

          {showOptions && (
            <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 w-52 bg-white rounded-lg shadow-2xl border border-gray-200 animate__animated animate__fadeIn z-30 overflow-hidden">
              <a
                href="http://localhost:5173/login"
                className="block px-5 py-3 text-blue-700 text-lg font-medium hover:bg-blue-50 transition-colors duration-200"
              >
                Login
              </a>
              <a
                href="http://localhost:5173/register"
                className="block px-5 py-3 text-blue-700 text-lg font-medium hover:bg-blue-50 transition-colors duration-200"
              >
                Register
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Illustration - moved lower */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 animate__animated animate__fadeIn animate__delay-4s z-0">
        <img
          src="https://www.iconpacks.net/icons/2/free-handshake-icon-3312-thumb.png"
          alt="Volunteer Illustration"
          className="w-full max-w-xs"
        />
      </div>
    </div>
  );
}

export default Home;
