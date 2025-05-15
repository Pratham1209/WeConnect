import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'

const socket = io('http://localhost:5000'); // Update to deployed server URL when needed

function VolunteerDashboard() {
  const [volunteer, setVolunteer] = useState(null);
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (userData?.role === 'volunteer') {
      setVolunteer(userData);
      setLoading(false);
    } else {
      window.location.href = '/login';
    }

    // Socket events
    socket.on('newHelpRequest', (data) => {
      console.log('📥 New help request:', data);
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
      setError('Connection error. Try again later.');
      setLoading(false);
    });

    return () => {
      socket.off('newHelpRequest');
      socket.off('updateHelpRequestStatus');
      socket.off('connect_error');
    };
  }, []);
const handleAction = (requestId, action) => {
    if (!requestId) {
      toast.warning('Missing request ID!');
      return;
    }

    const payload = {
      action,
      volunteerId: volunteer._id,
      volunteerName: volunteer.name,
    };

    fetch(`http://localhost:5000/api/help/helprequest/${requestId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
           toast.error(`${data.error}`);
        } else {
          console.log('✅ Request updated:', data);
          setHelpRequests((prev) =>
            prev.map((req) =>
              req._id === requestId
                ? {
                    ...req,
                    ...(action === 'accept'
                      ? {
                          status: 'accepted',
                          acceptedBy: volunteer.name,
                        }
                      : {
                          rejectedBy: [...(req.rejectedBy || []), volunteer._id],
                          rejectedByThisVolunteer: true,
                        }),
                  }
                : req
            )
          );
        }
      })
      .catch(() =>  toast.error('Error processing action.'));
  };
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-4xl font-bold mb-6">
        Welcome, {volunteer?.name || 'Volunteer'} 👋
      </h1>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Your Details:</h2>
          <p><strong>Name:</strong> {volunteer.name}</p>
          <p><strong>Email:</strong> {volunteer.email}</p>
          <p><strong>Role:</strong> {volunteer.role}</p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Incoming Help Requests:</h3>

            {helpRequests.length === 0 ? (
              <p>📋 No help requests yet.</p>
            ) : (
              <ul className="space-y-4">
                {helpRequests.map((req) => {
                  const isRejected = req.rejectedBy?.includes(volunteer._id);

                  if (isRejected) {
                    return (
                      <li key={req._id} className="bg-yellow-100 p-4 rounded-lg shadow">
                        <p className="text-yellow-800 font-semibold">❌ You rejected this request of {req.email}</p>
                      </li>
                    );
                  }

                  const isNearby =
                    volunteer.location && req.location
                      ? getDistanceFromLatLonInKm(
                          volunteer.location.coordinates[1],
                          volunteer.location.coordinates[0],
                          req.location.coordinates[1],
                          req.location.coordinates[0]
                        ) <= 5
                      : false;

                  return (
                    <li key={req._id} className="bg-gray-100 p-4 rounded-lg shadow">
                      <p><strong>From:</strong> {req.name} ({req.email})</p>
                      <p><strong>Description:</strong> {req.description}</p>

                      {req?.location?.coordinates && (
                        <a
                          href={`https://www.google.com/maps?q=${req.location.coordinates[1]},${req.location.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center space-x-2 text-blue-700 font-medium"
                        >
                          <span>📍 Navigate</span>
                          <img
                            src="https://cdn.vectorstock.com/i/1000v/05/61/google-map-navigation-icon-gps-location-vector-50150561.jpg"
                            alt="Google Maps"
                            className="w-6 h-6"
                          />
                        </a>
                      )}

                      <p className="text-sm text-gray-500">
                        ⏰ {req.time ? new Date(req.time).toLocaleString() : 'No timestamp'}
                      </p>
                      <p className="text-blue-500 font-semibold">
                        {isNearby
                          ? '📍 Within 5 km of your location'
                          : '📍 More than 5 km away'}
                      </p>

                      <p className="mt-2">
  <strong>Status:</strong>{' '}
  {req.status === 'accepted' ? (
    <span className="text-green-600">✅ Accepted by {req.acceptedBy}</span>
  ) : req.rejectedBy?.length > 0 ? (
    <span className="text-red-600">
  ❌ Rejected by {req.rejectedBy.map((v) => v.name).join(', ')}
</span>

  ) : (
    <span className="text-yellow-600">Pending</span>
  )}
</p>


                      {req.status === 'pending' && !isRejected && (
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
      )}
    </div>
  );
}

export default VolunteerDashboard;
