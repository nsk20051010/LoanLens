const jwt = require("jsonwebtoken");

const JWT_SECRET = "loanlens_secret_key"; // Must match auth.js

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  // Must start with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ensure the user object contains the user ID
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = { id: decoded.id };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
