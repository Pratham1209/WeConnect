
import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';

const socket = io('http://localhost:5000'); // Change to your server URL if deployed

function VolunteerDashboard() {
  const [volunteer, setVolunteer] = useState(null);
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (userData && userData.role === 'volunteer') {
      setVolunteer(userData);
      setLoading(false);
    } else {
      window.location.href = '/login';
    }

    socket.on('newHelpRequest', (data) => {
      console.log('📥 New help request received:', data);
      setHelpRequests((prev) => [data, ...prev]);
    });

    socket.on('updateHelpRequestStatus', (updatedRequest) => {
      console.log('🔄 Request status updated:', updatedRequest);
      setHelpRequests((prev) =>
        prev.map((req) =>
          req._id === updatedRequest._id ? updatedRequest : req
        )
      );
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to the server. Please try again later.');
      setLoading(false);
    });

    return () => {
      socket.off('newHelpRequest');
      socket.off('updateHelpRequestStatus');
      socket.off('connect_error');
    };
  }, []);

  const handleAction = (requestId, action) => {
    console.log('🔥 handleAction called with:', { requestId, action });

    if (!requestId) {
      alert('Error: Missing request ID!');
      return;
    }

    const actionData = {
      action,
      volunteerId: volunteer?._id,
      volunteerName: volunteer?.name,
    };

    fetch(`http://localhost:5000/api/help/helprequest/${requestId}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(actionData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          console.log('✅ Request updated:', data);

          if (action === 'accept') {
            setHelpRequests((prev) =>
              prev.map((req) =>
                req._id === requestId
                  ? {
                      ...req,
                      status: 'accepted',
                      acceptedBy: volunteer.name,
                    }
                  : req
              )
            );
          } else if (action === 'reject') {
            setHelpRequests((prev) =>
              prev.map((req) =>
                req._id === requestId
                  ? {
                      ...req,
                      rejectedByThisVolunteer: true, // flag to track rejection locally
                    }
                  : req
              )
            );
          }
        }
      })
      .catch(() => {
        alert('Error processing the action. Please try again.');
      });
  };

  // Haversine formula to calculate distance
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    
    // Log the differences in latitude and longitude
    console.log('🗺️ Latitude and Longitude of Volunteer:', lat1, lon1);
    console.log('🗺️ Latitude and Longitude of Request:', lat2, lon2);
    console.log('🗺️ Difference in Latitude (radians):', dLat);
    console.log('🗺️ Difference in Longitude (radians):', dLon);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    // Log intermediate values
    console.log('🔢 Haversine value (a):', a);
    console.log('🔢 Central angle (c):', c);
    
    const distance = R * c;
    console.log('📏 Calculated Distance (km):', distance); // Log final distance
    return distance;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-4xl font-bold mb-6">
        Welcome, {volunteer?.name || 'Volunteer'} 👋
      </h1>

      {loading ? (
        <p>Loading your dashboard...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : volunteer ? (
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Your Details:</h2>
          <p>
            <strong>Name:</strong> {volunteer.name}
          </p>
          <p>
            <strong>Email:</strong> {volunteer.email}
          </p>
          <p>
            <strong>Role:</strong> {volunteer.role}
          </p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">
              Incoming Help Requests:
            </h3>
            {helpRequests.length === 0 ? (
              <p>📋 No help requests yet.</p>
            ) : (
              <ul className="space-y-4">
                {helpRequests.map((req) => {
                  if (req.rejectedByThisVolunteer) return null;

                  const isNearby =
                    volunteer?.location && req?.location
                      ? getDistanceFromLatLonInKm(
                          volunteer.location.coordinates[1],
                          volunteer.location.coordinates[0],
                          req.location.coordinates[1],
                          req.location.coordinates[0]
                        ) <= 5
                      : false;

                  return (
                    <li
                      key={req._id}
                      className="bg-gray-100 p-4 rounded-lg shadow"
                    >
                      <p>
                        <strong>From:</strong> {req.name} ({req.email})
                      </p>
                      {/* <p>
                        <strong>Description:</strong> {req.description}
                      </p> */}
                      <p>
  <strong>Description:</strong> {req.description}
</p>

{req?.location?.coordinates && (
  <p className="mt-2">
    <a
      href={`https://www.google.com/maps?q=${req.location.coordinates[1]},${req.location.coordinates[0]}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      🗺️ Navigate to Location on Google Maps
    </a>
  </p>
)}

                      <p className="text-sm text-gray-500">
                        ⏰{' '}
                        {req.time
                          ? new Date(req.time).toLocaleString()
                          : 'No timestamp'}
                      </p>
                      <p className="text-blue-500 font-semibold">
                        {isNearby
                          ? '📍 This request is within 5 km of your location'
                          : '📍 This request is more than 5 km away'}
                      </p>

                      <p className="mt-2">
                        <strong>Status:</strong>{' '}
                        {req.status === 'accepted' ? (
                          <span className="text-green-600">
                            Accepted by {req.acceptedBy}
                          </span>
                        ) : (
                          <span className="text-yellow-600">Pending</span>
                        )}
                      </p>

                      {req.status === 'pending' && (
                        <div className="mt-4 flex space-x-4">
                          <button
                            onClick={() => handleAction(req._id, 'accept')}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleAction(req._id, 'reject')}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default VolunteerDashboard;
