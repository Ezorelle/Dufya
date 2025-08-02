const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/User');
const viewsPath = path.join(__dirname, 'views');
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
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    httpOnly: true,
    sameSite: 'lax', 
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Middleware to protect routes
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/Login.html'); // Redirect instead of JSON
  }
  next();
}
app.get('/index.html', requireLogin, (req, res) => {
  console.log("User accessing dashboard:", req.session.user);
  res.sendFile(path.join(viewsPath, 'index.html'));
});
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve login page
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/index.html'); // If logged in, send to dashboard
  } else {
    return res.redirect('/Login.html'); // Else, send to login page
  }
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

  if (!phone || !password) {
    return res.status(400).json({ success: false, message: 'Phone and password are required.' });
  }

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid phone or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid phone or password.' });
    }

    // Store minimal user data in session
    req.session.user = {
      id: user._id.toString(),
      phone: user.phone,
      fullName: user.fullName
    };

    return res.status(200).json({ success: true, message: 'Login successful.' });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'An error occurred during login.', error: err.message });
  }
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
