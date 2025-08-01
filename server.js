const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB URI
const MONGO_URI = "mongodb+srv://ezorelle23:daniel123@cluster0.dlmpmvb.mongodb.net/dufyaDB?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected 😎"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Session setup
app.use(session({
  secret: 'your-secret-key', // Replace with an env var in production
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Middleware to protect routes
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
  next();
}

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});

// REGISTER
app.post('/register', async (req, res) => {
  const { fullName, phone, birthDate, password, gender, address, country, city } = req.body;

  if (!fullName || !phone || !birthDate || !password) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  const userExists = await User.findOne({ phone });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      phone,
      birthDate,
      password: hashedPassword,
      gender,
      address,
      country,
      city
    });

    await newUser.save();
    res.json({ message: 'Registration successful.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register user.', error: err.message });
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(401).json({ message: 'Invalid phone or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid phone or password.' });
  }

  req.session.user = user;
  res.json({ success: true });
});

// Protected page
app.get('/index.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// LOGOUT
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully.' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT} 🥶`);
});
