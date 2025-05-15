import React, { useState } from 'react';
import 'animate.css';
import { toast } from 'react-toastify';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...credentials, location: { latitude, longitude } }),
          });

          const data = await response.json();

          if (response.status === 200) {
            toast.success('Logged in successfully!', {
              autoClose: 2000,
              onClose: () => {
                if (data.user.role === 'volunteer') {
                  window.location.href = '/volunteer-dashboard';
                } else {
                  window.location.href = '/helprequest';
                }
              },
            });

            localStorage.setItem('user', JSON.stringify(data.user));
          } else {
            toast.error(`Login failed: ${data.error}`, { autoClose: 3000 });
          }
        },
        () => {
          toast.warning('📍 Location access denied. Please allow location access for volunteers.', {
            autoClose: 3000,
          });
        }
      );
    } catch (err) {
      console.error('Error:', err);
      toast.error('An error occurred. Please try again.', { autoClose: 3000 });
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center">
      <div
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg transition-transform duration-700 hover:scale-105 animate__animated animate__fadeIn"
      >
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 animate__animated animate__fadeInDown animate__delay-1s">
          Login to Your Account
        </h2>

        <form onSubmit={handleLogin} className="space-y-6 animate__animated animate__fadeInUp animate__delay-2s">
          <div>
            <input
              placeholder="Email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full p-4 rounded-md text-gray-800 bg-gray-100 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 hover:bg-white hover:border-blue-500"
            />
          </div>

          <div>
            <input
              placeholder="Password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full p-4 rounded-md text-gray-800 bg-gray-100 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 hover:bg-white hover:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-lg text-white bg-gradient-to-r from-teal-400 to-blue-500 text-lg font-semibold transition-transform duration-300 hover:scale-105"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/register" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
