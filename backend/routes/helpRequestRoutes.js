const express = require('express');
const HelpRequest = require('../models/HelpRequest');

const createHelpRequestRouter = (io) => {
  const router = express.Router();

  // ✅ Create a new help request
  router.post('/helprequest', async (req, res) => {
    const { name, email, description } = req.body;

    try {
      const newRequest = new HelpRequest({ name, email, description });
      await newRequest.save();

      io.emit('newHelpRequest', newRequest); // Notify volunteers
      res.status(201).json(newRequest);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error saving help request' });
    }
  });

// ✅ Accept or Reject a help request
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

      // Emit to all clients (notify everyone that the request is accepted)
      io.emit('updateHelpRequestStatus', helpRequest);
    } else if (action === 'reject') {
      helpRequest.status = 'pending';

      // Emit only to the rejecting volunteer (to notify them)
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

