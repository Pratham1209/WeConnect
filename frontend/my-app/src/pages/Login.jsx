import React, { useState } from 'react';
import 'animate.css';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });


const handleLogin = async (e) => {
  e.preventDefault();
  console.log('Logging in with:', credentials);

  try {
    // Step 1: Get geolocation
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      // Step 2: Send login request with coordinates
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...credentials, location: { latitude, longitude } }),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert('✅ Login successful!');
        localStorage.setItem('user', JSON.stringify(data.user));

        // Step 3: Redirect based on role
        if (data.user.role === 'volunteer') {
          window.location.href = '/volunteer-dashboard';
        } else {
          window.location.href = '/helprequest';
        }
      } else {
        alert(`❌ Login failed: ${data.error}`);
      }
    }, (err) => {
      alert('Location access denied. Please allow location access for volunteers.');
    });

  } catch (err) {
    console.error('Error:', err);
    alert('An error occurred. Please try again.');
  }
};


  return (
    <div className="h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg transform transition-all duration-700 hover:scale-105 animate__animated animate__fadeIn">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 animate__animated animate__fadeIn animate__delay-1s">
          Login to Your Account
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <input
              placeholder="Email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full p-4 rounded-md text-gray-800 bg-gray-100 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:bg-white hover:border-blue-500"
            />
            <span className="absolute top-0 left-0 text-xs text-gray-500 transform translate-y-1/2 px-2">Email</span>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              placeholder="Password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full p-4 rounded-md text-gray-800 bg-gray-100 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:bg-white hover:border-blue-500"
            />
            <span className="absolute top-0 left-0 text-xs text-gray-500 transform translate-y-1/2 px-2">Password</span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-lg text-white bg-gradient-to-r from-teal-400 to-blue-500 text-lg font-semibold transform transition-all duration-300 hover:scale-110 hover:bg-teal-500 hover:from-teal-500 hover:to-blue-400"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="http://localhost:5173/register" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
