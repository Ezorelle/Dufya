require("dotenv").config();
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const User = require("./models/User");
const connectDB = require("./db");

const app = express();
const viewsPath = path.join(__dirname, "views");

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to DB
connectDB();

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.sendFile(path.join(__dirname, "public", "Login.html"));
  }
  next();
}

// Routes
app.get("/", (req, res) => {
  if (req.session.user) {
    return res.sendFile(path.join(viewsPath, "index.html"));
  }
  return res.sendFile(path.join(__dirname, "public", "Login.html"));
});

app.get("/index.html", requireLogin, (req, res) => {
  console.log("User accessing dashboard:", req.session.user);
  res.sendFile(path.join(viewsPath, "index.html"));
});

// REGISTER
app.post("/register", async (req, res) => {
  const { fullName, phone, birthDate, password, gender, address, country, city } = req.body;

  if (!fullName || !phone || !birthDate || !password) {
    return res.redirect("/Register.html?error=All+required+fields+must+be+filled");
  }

  try {
    const userExists = await User.findOne({ phone });
    if (userExists) return res.redirect("/Register.html?error=User+already+exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      phone,
      birthDate,
      password: hashedPassword,
      gender,
      address,
      country,
      city,
    });

    await newUser.save();
    return res.redirect("/Login.html");
  } catch (err) {
    console.error("Register error:", err);
    return res.redirect("/Register.html?error=Registration+failed");
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.redirect("/Login.html?error=Phone+and+password+are+required");

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.redirect("/Login.html?error=Invalid+phone+or+password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.redirect("/Login.html?error=Invalid+phone+or+password");

    req.session.user = {
      id: user._id.toString(),
      phone: user.phone,
      fullName: user.fullName,
    };
    return res.redirect("/index.html");
  } catch (err) {
    console.error("Login error:", err);
    return res.redirect("/Login.html?error=Login+failed");
  }
});

// LOGOUT
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully." });
  });
});

module.exports = app;
