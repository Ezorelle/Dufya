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

// ✅ Connect DB
connectDB().catch(err => {
  console.error("MongoDB connection failed:", err);
});

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure cookies only in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Auth middleware
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
  res.sendFile(path.join(viewsPath, "index.html"));
});

// API routes
app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
app.use("/api/logout", logoutRoute);

// 404 fallback
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// ✅ EXPORT APP (Vercel serverless-friendly)
module.exports = app;

// run locally 
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Local server running at http://localhost:${PORT}`);
  });
}
