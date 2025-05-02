// import React, { useEffect, useState } from 'react';

// function VolunteerDashboard() {
//   const [volunteer, setVolunteer] = useState(null);

//   useEffect(() => {
//     // Get the logged-in user from localStorage
//     const userData = JSON.parse(localStorage.getItem('user'));
//     if (userData && userData.role === 'volunteer') {
//       setVolunteer(userData);
//     } else {
//       // Not a volunteer? Redirect away
//       window.location.href = '/login';
//     }
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-col items-center justify-center text-white p-4">
//       <h1 className="text-4xl font-bold mb-6">Welcome, {volunteer.name || 'N/A'} 👋</h1>

//       {volunteer ? (
//         <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
//           <h2 className="text-2xl font-semibold mb-4">Your Details:</h2>
//           <p><strong>Name:</strong> {volunteer.name || 'N/A'}</p>
//           <p><strong>Email:</strong> {volunteer.email}</p>
//           <p><strong>Role:</strong> {volunteer.role}</p>

//           <div className="mt-6">
//             <h3 className="text-xl font-semibold mb-2">Your Help Requests:</h3>
//             <p>📋 (This is where you can list real-time help requests later.)</p>
//           </div>
//         </div>
//       ) : (
//         <p>Loading your dashboard...</p>
//       )}
//     </div>
//   );
// }

// export default VolunteerDashboard;

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Update if you deploy

function VolunteerDashboard() {
  const [volunteer, setVolunteer] = useState(null);
  const [helpRequests, setHelpRequests] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.role === 'volunteer') {
      setVolunteer(userData);
    } else {
      window.location.href = '/login';
    }

    // ✅ Listen for new help requests
    socket.on('newHelpRequest', (data) => {
      console.log('📥 New help request received:', data);
      setHelpRequests((prev) => [data, ...prev]); // Add to top
    });

    // Cleanup on unmount
    return () => {
      socket.off('newHelpRequest');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome, {volunteer?.name || 'N/A'} 👋</h1>

      {volunteer ? (
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Your Details:</h2>
          <p><strong>Name:</strong> {volunteer.name || 'N/A'}</p>
          <p><strong>Email:</strong> {volunteer.email}</p>
          <p><strong>Role:</strong> {volunteer.role}</p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Incoming Help Requests:</h3>
            {helpRequests.length === 0 ? (
              <p>📋 No help requests yet.</p>
            ) : (
              <ul className="space-y-4">
                {helpRequests.map((req, index) => (
                  <li key={index} className="bg-gray-100 p-4 rounded-lg shadow">
                    <p><strong>From:</strong> {req.name} ({req.email})</p>
                    <p><strong>Description:</strong> {req.description}</p>
                    <p className="text-sm text-gray-500">⏰ {new Date(req.time).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <p>Loading your dashboard...</p>
      )}
    </div>
  );
}

export default VolunteerDashboard;
