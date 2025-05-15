// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const HelpRequest = require('./models/HelpRequest');

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

const userSockets = new Map(); // email -> socket.id
// Routes
app.use('/api/auth', authRoutes);
const helpRequestRoutes = require('./routes/helpRequestRoutes')(io, userSockets);
app.use('/api/help', helpRequestRoutes);

// Socket connection

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('registerUser', (email) => {
    userSockets.set(email, socket.id);
    console.log(`🔗 Registered: ${email} -> ${socket.id}`);
  });

  socket.on('volunteerAction', ({ userEmail, message }) => {
    const userSocketId = userSockets.get(userEmail);
    if (userSocketId) {
      io.to(userSocketId).emit('notifyUser', message);
      console.log(`📢 Notified ${userEmail} -> ${message}`);
    } else {
      console.log(`⚠️ No active socket for ${userEmail}`);
    }
  });

  socket.on('disconnect', () => {
    for (const [email, id] of userSockets.entries()) {
      if (id === socket.id) {
        userSockets.delete(email);
        break;
      }
    }
    console.log('Client disconnected');
  });


  // Optional: Accept/reject via socket
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
      } else {
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

// Start server after DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(process.env.PORT || 5000, () => {
      console.log('Server running on port', process.env.PORT || 5000);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
