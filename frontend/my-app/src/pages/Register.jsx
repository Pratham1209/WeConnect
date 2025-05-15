import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

function Register() {
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [role, setRole] = useState('member'); // 'member' or 'volunteer'
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log(`Registering as ${role}:`, user);
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...user, role }), //  Send role to backend too
      });
  
      const data = await response.json();
  
      if (response.status === 201) {
  toast.success(`Successfully registered as ${role}! Redirecting to login...`, {
    autoClose: 2000,
    onClose: () => {
      navigate('/login'); 
    }
  });
} else {
  toast.error(`Error: ${data.error}`, { autoClose: 3000 });
}
} catch {
  toast.error('An error occurred. Please try again.', { autoClose: 3000 });
}

  };
  

  return (
    <div className="h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md animate__animated animate__fadeIn animate__delay-1s"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register to Join
        </h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => setRole('member')}
            className={`px-4 py-2 rounded-l-lg ${
              role === 'member'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Register as Member
          </button>
          <button
            type="button"
            onClick={() => setRole('volunteer')}
            className={`px-4 py-2 rounded-r-lg ${
              role === 'volunteer'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Register as Volunteer
          </button>
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 transform hover:scale-105"
            placeholder="Enter your name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>

       
        <div className="mb-4">
          <label className="block text-gray-600 mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 transform hover:scale-105"
            placeholder="Enter your email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>

      
        <div className="mb-6">
          <label className="block text-gray-600 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 transform hover:scale-105"
            placeholder="Enter your password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
        </div>

        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
        >
          Register as {role === 'volunteer' ? 'Volunteer' : 'Member'}
        </button>
      </form>
    </div>
  );
}

export default Register;


