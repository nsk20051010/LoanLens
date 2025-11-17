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

/* ======================================================
   🔥 FIXED CORS CONFIG FOR RENDER FRONTEND
====================================================== */

app.use(
  cors({
    origin: [
      "https://loanlens-0rit.onrender.com", // Your frontend on Render
      "http://localhost:3000"               // Local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ======================================================
   GLOBAL MIDDLEWARES
====================================================== */

app.use(express.json());
app.use(morgan("dev"));

/* ======================================================
   PUBLIC ROUTES
====================================================== */
app.use("/api/auth", authRoutes);

/* ======================================================
   PROTECTED ROUTES (Require JWT)
====================================================== */
app.use("/api/members", authMiddleware, membersRoutes);
app.use("/api/loans", authMiddleware, loansRoutes);

/* ======================================================
   HEALTH CHECK
====================================================== */
app.get("/api/health", (req, res) =>
  res.json({ ok: true, time: new Date() })
);

/* ======================================================
   ERROR HANDLER
====================================================== */
app.use(errorHandler);

/* ======================================================
   KEEP RENDER BACKEND ALWAYS AWAKE
====================================================== */

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://backendofloanlens.onrender.com";

cron.schedule("*/5 * * * *", () => {
  axios
    .get(BACKEND_URL + "/api/health")
    .then(() => console.log("💓 Keep-alive ping sent"))
    .catch(() => console.log("⚠️ Keep-alive ping failed"));
});

/* ======================================================
   DATABASE CONNECTION
====================================================== */

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: Missing MONGO_URI in environment variables!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    console.log("📌 Using DB:", mongoose.connection.db.databaseName);

    // Debug: list collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "📁 Collections:",
      collections.map((c) => c.name)
    );

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
