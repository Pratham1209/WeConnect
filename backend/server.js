
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config(); // ✅ Load env vars

// const authRoutes = require('./routes/authRoutes');
// const helpRequestRoutes = require('./routes/helpRequestRoutes');  // Import help request route

// const app = express();

// // ✅ Middleware
// app.use(cors());
// app.use(express.json());

// // ✅ Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/help', helpRequestRoutes);  // Handle help requests

// // ✅ Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('✅ Connected to MongoDB');
//     app.listen(5000, () => {
//       console.log('🚀 Server is running on port 5000');
//     });
//   })
//   .catch((err) => {
//     console.error('❌ Error connecting to MongoDB:', err);
//   });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const http = require('http'); // ⬅️ Add this
const { Server } = require('socket.io'); // ⬅️ Add this

const authRoutes = require('./routes/authRoutes');
const helpRequestRoutes = require('./routes/helpRequestRoutes');

const app = express();
const server = http.createServer(app); // ⬅️ Wrap your app in a server
const io = new Server(server, {
  cors: {
    origin: "*", // Make sure to adjust in production
    methods: ["GET", "POST"]
  }
});

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);

// Pass the socket.io instance to the route
const helpRequestRoutesWithSocket = require('./routes/helpRequestRoutes')(io);
app.use('/api/help', helpRequestRoutesWithSocket);

// ✅ Socket connection
io.on('connection', (socket) => {
  console.log('🟢 A client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 A client disconnected:', socket.id);
  });
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(5000, () => { // ⬅️ server.listen instead of app.listen
      console.log('🚀 Server is running on port 5000');
    });
  })
  .catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err);
  });
