const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs'); //im using bycryptjs for my project
const User = require('./models/User');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());

app.use(session({
  secret: 'dufya-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Serve login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});
app.use(express.static(path.join(__dirname, 'public')));

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
  next();
}

mongoose.connect("mongodb+srv://ezorelle23:daniel123@cluster0.dlmpmvb.mongodb.net/dufyaDB?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected😎"))
  .catch((err) => console.error("MongoDB connection error:", err));

// REGISTER route
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
    const hashedPassword = await bcrypt.hash(password, 10); // ✅ hash password
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

// LOGIN route
app.post('/login', async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(401).json({ message: 'Invalid phone or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password); // ✅ compare hash
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid phone or password.' });
  }

  req.session.user = user;
  res.json({ success: true });
});

app.get('/index.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully.' });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT} 🥶`);
});
