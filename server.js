require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./db");

// Import API routes
const loginRoute = require("./api/login");
const registerRoute = require("./api/register");
const logoutRoute = require("./api/logout");

const app = express();

// Trust proxy 
app.set("trust proxy", 1);

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB 
connectDB()
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    
  });

// Session middleware 
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-super-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 24 * 60 * 60, 
      autoRemove: "native", 
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Auth middleware
const requireLogin = (req, res, next) => {
  if (!req.session?.user) {
    // Redirect unauthenticated users to login page
    return res.sendFile(path.join(__dirname, "public", "Login.html"));
  }
  next();
};

// Routes
app.get("/", (req, res) => {
  if (req.session?.user) {
    return res.sendFile(path.join(__dirname, "views", "index.html"));
  }
  res.sendFile(path.join(__dirname, "public", "Login.html"));
});

// Protected main page
app.get("/index.html", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// API routes
app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
app.use("/api/logout", logoutRoute);

// Catch-all 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});


module.exports = app;