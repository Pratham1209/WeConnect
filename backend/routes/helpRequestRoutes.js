// const express = require('express');
// const HelpRequest = require('../models/HelpRequest');
// const User = require('../models/User');
// const router = express.Router();

// ✅ ✅ ✅ GET /api/help/volunteers (Moved OUTSIDE)
// router.get('/volunteers', async (req, res) => {
//   try {
//     const volunteers = await User.find({ role: 'volunteer' }).select('name email'); // only send needed fields
//     res.json(volunteers);
//   } catch (err) {
//     console.error('Error fetching volunteers:', err);
//     res.status(500).json({ error: 'Server error.' });
//   }
// });

// router.post('/helprequest', async (req, res) => {
//   const { name, email, description } = req.body;

//   if (!name || !email || !description) {
//     return res.status(400).json({ error: 'All fields are required.' });
//   }

//   try {
//     // 1️⃣ Find all volunteers
//     const volunteers = await User.find({ role: 'volunteer' });

//     if (volunteers.length === 0) {
//       return res.status(200).json({ message: 'No volunteers available right now.' });
//     }

//     // 2️⃣ Send notification (for now just log, later email/real notif)
//     volunteers.forEach((vol) => {
//       console.log(`🔔 Notify: ${vol.name} (${vol.email}) - Help request from ${name}: ${description}`);
//       // Here you'd integrate email service / push notification etc.
//     });

//     return res.status(200).json({ message: 'Help request sent to volunteers!' });
//   } catch (err) {
//     console.error('Error handling help request:', err);
//     res.status(500).json({ error: 'Server error.' });
//   }
// });

// module.exports = router;
const express = require('express');
const User = require('../models/User');

module.exports = function(io) { // ⬅️ Export as a function with io
  const router = express.Router();

  router.post('/helprequest', async (req, res) => {
    const { name, email, description } = req.body;

    if (!name || !email || !description) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
      const volunteers = await User.find({ role: 'volunteer' });

      if (volunteers.length === 0) {
        return res.status(200).json({ message: 'No volunteers available right now.' });
      }

      // ✅ Broadcast to all connected volunteers
      io.emit('newHelpRequest', {
        name,
        email,
        description,
        time: new Date().toISOString()
      });

      console.log(`🔔 Sent real-time help request: ${name}: ${description}`);

      return res.status(200).json({ message: 'Help request sent to volunteers!' });
    } catch (err) {
      console.error('Error handling help request:', err);
      res.status(500).json({ error: 'Server error.' });
    }
  });

  return router;
};
