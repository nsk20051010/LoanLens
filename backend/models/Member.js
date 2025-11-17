const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true     // ⭐ IMPORTANT: member belongs to one logged-in user
  },

  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },

  createdAt: { type: Date, default: Date.now }
});

// Balance will be computed inside routes (NOT stored here)
module.exports = mongoose.model('Member', MemberSchema);
