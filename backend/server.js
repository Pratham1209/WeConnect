const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const HelpRequest = require('./models/HelpRequest'); // ✅ Correct import

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
const helpRequestRoutesWithSocket = require('./routes/helpRequestRoutes')(io);
app.use('/api/help', helpRequestRoutesWithSocket);

// Socket connection (Optional real-time updates)
io.on('connection', (socket) => {
  console.log('🟢 A client connected:', socket.id);

  // If you want to keep the socket way of handling actions:
  socket.on('helpRequestAction', async (data, callback) => {
    const { requestId, action, volunteerId, volunteerName } = data;
    console.log(`⚡ Volunteer action:`, data);

    try {
      const helpRequest = await HelpRequest.findById(requestId);
      if (!helpRequest) {
        return callback({ success: false, error: 'Help request not found' });
      }

      if (helpRequest.status !== 'pending') {
        return callback({ success: false, error: `Request already ${helpRequest.status}` });
      }

      if (action === 'accept') {
        helpRequest.status = 'accepted';
        helpRequest.acceptedBy = volunteerName || 'Unknown';
        helpRequest.acceptedById = volunteerId || null;
      } else if (action === 'pending') {
        helpRequest.status = 'pending';
      } else {
        console.log("AAA", action);
        return callback({ success: false, error: 'Invalid action' });
      }

      await helpRequest.save();
      io.emit('updateHelpRequestStatus', helpRequest);
      callback({ success: true });
    } catch (err) {
      console.error(err);
      callback({ success: false, error: 'Error processing the request' });
    }
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(process.env.PORT || 5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
