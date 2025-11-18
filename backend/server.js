require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cron = require("node-cron");
const axios = require("axios");

// ROUTES
const authRoutes = require("./routes/auth");
const membersRoutes = require("./routes/members");
const loansRoutes = require("./routes/loans");

// MIDDLEWARE
const authMiddleware = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");

const app = express();

/* ============================================
   ✅ CORS (IMPORTANT)
============================================ */

app.use(cors({
  origin: [
    "https://loanlens-0rit.onrender.com",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* ============================================
   Normal Middleware
============================================ */

app.use(express.json());
app.use(morgan("dev"));

/* ============================================
   Public Routes
============================================ */
app.use("/api/auth", authRoutes);

/* ============================================
   Protected Routes
============================================ */
app.use("/api/members", authMiddleware, membersRoutes);
app.use("/api/loans", authMiddleware, loansRoutes);

/* ============================================
   Health
============================================ */
app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date() });
});

/* ============================================
   Error Handler
============================================ */
app.use(errorHandler);

/* ============================================
   DB Connection
============================================ */

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI missing in Render!");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    console.log("➡ Using DB:", mongoose.connection.db.databaseName);

    const collections = await mongoose.connection.db
      .listCollections().toArray();

    console.log("➡ Collections:", collections.map(c => c.name));
  })
  .catch(err => {
    console.error("❌ MongoDB Error:", err);
  });

/* ============================================
   🟢 Keep Backend Awake (RENDER FIX)
============================================ */
cron.schedule("*/12 * * * *", async () => {
  try {
    console.log("⏳ Keeping backend alive...");
    await axios.get("https://backendofloanlens.onrender.com/api/health");
    console.log("🔵 Backend pinged successfully.");
  } catch (err) {
    console.log("⚠ Backend sleep ping failed");
  }
});

/* ============================================
   Start Server
============================================ */

app.listen(PORT, () => {
  console.log(`🚀 Server live at port ${PORT}`);
});
