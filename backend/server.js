require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

// ROUTES
const authRoutes = require("./routes/auth");
const membersRoutes = require("./routes/members");
const loansRoutes = require("./routes/loans");

// MIDDLEWARE
const authMiddleware = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");

const app = express();

/* ======================================================
   CORS CONFIG (IMPORTANT FOR RENDER + FRONTEND)
====================================================== */

const allowedOrigins = ("https://loanlens-0rit.onrender.com" || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Requests without origin (curl, server-to-server)
    if (!origin) return callback(null, true);

    // Wildcard support
    if (allowedOrigins.includes("*")) return callback(null, true);

    // Allow if origin in allowed list
    if (allowedOrigins.includes(origin)) return callback(null, true);

    return callback(new Error("Not allowed by CORS: " + origin), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: false // using JWT, not cookies
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

/* ======================================================
   PUBLIC ROUTES (NO AUTH REQUIRED)
====================================================== */

app.use("/api/auth", authRoutes);

/* ======================================================
   PROTECTED ROUTES (JWT REQUIRED)
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
   DATABASE CONNECTION
====================================================== */

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/loanlens";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    console.log("📌 Using DB:", mongoose.connection.db.databaseName);

    // Debugging: list collections (safe to keep)
    const collections = await mongoose.connection.db.listCollections().toArray();
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
