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

// ---------------------
// Global Middlewares
// ---------------------
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ---------------------
// PUBLIC ROUTES (No Auth Required)
// ---------------------
app.use("/api/auth", authRoutes);

// ---------------------
// PROTECTED ROUTES (Auth Required)
// ---------------------
app.use("/api/members", authMiddleware, membersRoutes);
app.use("/api/loans", authMiddleware, loansRoutes);

// ---------------------
// Health Check
// ---------------------
app.get("/api/health", (req, res) =>
  res.json({ ok: true, time: new Date() })
);

// ---------------------
// Global Error Handler
// ---------------------
app.use(errorHandler);

// ---------------------
// Database Connection
// ---------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/loanlens";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");

    // Print actual DB name (debugging)
    console.log("Using DB:", mongoose.connection.db.databaseName);

    // Print existing collections (debug)
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Collections:",
      collections.map((c) => c.name)
    );

    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
