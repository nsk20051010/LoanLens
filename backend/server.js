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
   🔥 FIXED CORS CONFIG FOR RENDER FRONTEND
====================================================== */

app.use(
  cors({
    origin: [
      "https://loanlens-0rit.onrender.com",  // Your Render frontend
      "http://localhost:3000"                // Local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ======================================================
   NORMAL MIDDLEWARES
====================================================== */

app.use(express.json());
app.use(morgan("dev"));

/* ======================================================
   PUBLIC ROUTES
====================================================== */

app.use("/api/auth", authRoutes);

/* ======================================================
   PROTECTED ROUTES
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
