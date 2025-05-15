

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import 'animate.css';

const socket = io('http://localhost:5000'); // Connect to backend

function HelpRequest() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    time: '',
  });

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');4
  const [notificationMessage, setNotificationMessage] = useState('');


  // ✅ Step 3: Register user on socket connect
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setFormData((prev) => ({
        ...prev,
        name: loggedInUser.name || '',
        email: loggedInUser.email || '',
        time: new Date().toISOString(),
      }));

      socket.emit('registerUser', loggedInUser.email); // 🔔 Register user socket
    }
  }, []);

  // ✅ Step 2: Listen for real-time notifications
  useEffect(() => {
  socket.on('notifyUser', (message) => {
    setNotificationMessage(message);
    setTimeout(() => setNotificationMessage(''), 12000) // Auto-hide
  });

  return () => {
    socket.off('notifyUser');
  };
}, []);


  // ✅ Step 4: Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ type: 'Point', coordinates: [longitude, latitude] });
        },
        () => {
          setErrorMessage('Failed to get your location.');
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by your browser.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.description.trim()) {
      setErrorMessage('Please enter a valid description.');
      return;
    }

    if (!location) {
      setErrorMessage('Location not available yet. Please try again.');
      return;
    }

    const helpData = {
      ...formData,
      location,
    };

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/help/helprequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(helpData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('✅ Help request sent successfully!');
        setFormData((prev) => ({ ...prev, description: '' }));
      } else {
        setErrorMessage(data.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Error submitting help request:', err);
      setErrorMessage('Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-6">
   {notificationMessage && (
  <div className="fixed top-6 right-6 max-w-sm w-fit bg-yellow-100 text-yellow-800 px-6 py-3 rounded-lg shadow-lg z-50 animate__animated animate__fadeInRight break-words">
    {notificationMessage}
  </div>
)}


      <div className="w-full max-w-lg bg-white/30 backdrop-blur-lg rounded-xl shadow-2xl p-8 animate__animated animate__fadeIn">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">🚨 Request Help</h2>
        
        <p className="text-center text-white/80 mb-6">
          Fill in the details below to request help from volunteers.
        </p>

        {successMessage && (
          <div className="mb-6 p-3 text-green-800 bg-green-100 rounded-lg text-center font-semibold animate__animated animate__fadeIn">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-3 text-red-800 bg-red-100 rounded-lg text-center font-semibold animate__animated animate__fadeIn">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-white font-semibold">Your Name</label>
            <input
              type="text"
              value={formData.name}
              readOnly
              className="w-full p-3 rounded-lg bg-white/60 text-gray-700 border border-gray-300"
            />
          </div>
          <div>
            <label className="block mb-1 text-white font-semibold">Your Email</label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full p-3 rounded-lg bg-white/60 text-gray-700 border border-gray-300"
            />
          </div>
          <div>
            <label className="block mb-1 text-white font-semibold">Description</label>
            <textarea
              placeholder="Describe your help request..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full p-3 h-32 rounded-lg bg-white/60 text-gray-700 border border-gray-300 resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 text-white text-lg font-bold transform transition-all duration-300 hover:scale-105 shadow-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Sending...' : '🚀 Send Help Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default HelpRequest;
