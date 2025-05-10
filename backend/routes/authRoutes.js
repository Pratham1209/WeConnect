const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Register route (✅ already there)
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please fill all fields.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role && ['volunteer', 'member'].includes(role) ? role : 'member',
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});


// 🔐 Login route (ADD THIS)
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: 'Please fill all fields.' });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: 'User not found.' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid credentials.' });
//     }

//     // ✅ Login successful (no password in response)
//     res.status(200).json({
//       message: 'Login successful!',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Server error.' });
//   }
// });

// module.exports = router;
router.post('/login', async (req, res) => {
  const { email, password, location } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please fill all fields.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // ✅ If user is volunteer and location is provided, update location
    if (user.role === 'volunteer' && location?.latitude && location?.longitude) {
      user.location = {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      };
      await user.save(); // Save the updated location
    }

    // ✅ Login successful (no password in response)
    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location, // include location if needed
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});
module.exports = router;

