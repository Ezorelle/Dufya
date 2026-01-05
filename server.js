require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./db");

// Import modular API routes
const loginRoute = require("./api/login");
const registerRoute = require("./api/register");
const logoutRoute = require("./api/logout");

const app = express();
const viewsPath = path.join(__dirname, "views");

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
      secure: true, 
      sameSite: "none", 
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

//static files 
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
  if (req.session.user) return res.sendFile(path.join(viewsPath, "index.html"));
  return res.sendFile(path.join(__dirname, "public", "Login.html"));
});

app.get("/index.html", requireLogin, (req, res) => {
  console.log("User accessing dashboard:", req.session.user);
  res.sendFile(path.join(viewsPath, "index.html"));
});

// API routes
app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
app.use("/api/logout", logoutRoute);

// 404 fallback
app.use((req, res) => res.status(404).send("Page not found"));

// Serverless handler
module.exports = async (req, res) => {
  try {
    await connectDB(); 
    app(req, res);
  } catch (err) {
    console.error("Serverless function error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
