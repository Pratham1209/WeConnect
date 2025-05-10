
const express = require('express');
const HelpRequest = require('../models/HelpRequest');

const createHelpRequestRouter = (io) => {
  const router = express.Router();



router.post('/find-volunteers', async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required.' });
  }

  try {
    const volunteers = await User.find({
      role: 'volunteer',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 5000, // 5 km radius
        },
      },
    });

    res.status(200).json({ volunteers });
  } catch (err) {
    console.error('Error finding nearby volunteers:', err);
    res.status(500).json({ error: 'Server error' });
  }
});





  // Create a new help request
  router.post('/helprequest', async (req, res) => {
    console.log('Incoming request:', req.body);

    const { name, email, description, location } = req.body;
    const coordinates = location?.coordinates || [];

    if (
      !Array.isArray(coordinates) ||
      coordinates.length !== 2 ||
      typeof coordinates[0] !== 'number' ||
      typeof coordinates[1] !== 'number' ||
      isNaN(coordinates[0]) ||
      isNaN(coordinates[1])
    ) {
      return res.status(400).json({ error: 'Invalid or missing location coordinates' });
    }

    try {
      const newRequest = new HelpRequest({
        name,
        email,
        description,
        location: {
          type: 'Point',
          coordinates: coordinates, // [longitude, latitude]
        },
      });

      await newRequest.save();

      io.emit('newHelpRequest', newRequest); // Notify volunteers
      res.status(201).json(newRequest);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error saving help request' });
    }
  });

  // Accept or Reject a help request
  router.post('/helprequest/:id/action', async (req, res) => {
    const { action, volunteerName, volunteerId } = req.body;
    const { id } = req.params;

    try {
      const helpRequest = await HelpRequest.findById(id);
      if (!helpRequest) {
        return res.status(404).json({ error: 'Help request not found' });
      }

      if (helpRequest.status !== 'pending') {
        return res.status(400).json({ error: `Request already ${helpRequest.status}` });
      }

      if (action === 'accept') {
        helpRequest.status = 'accepted';
        helpRequest.acceptedBy = volunteerName || 'Unknown';
        helpRequest.acceptedById = volunteerId || null;

        io.emit('updateHelpRequestStatus', helpRequest);
      } else if (action === 'reject') {
        helpRequest.status = 'pending';
        io.to(volunteerId).emit('updateHelpRequestStatus', helpRequest);
      } else if (action === 'pending') {
        helpRequest.status = 'pending';
      } else {
        return res.status(400).json({ error: 'Invalid action' });
      }

      await helpRequest.save();
      res.status(200).json(helpRequest);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating help request' });
    }
  });

  return router;
};

module.exports = createHelpRequestRouter;
