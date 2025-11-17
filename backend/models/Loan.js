const mongoose = require('mongoose');

const RepaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  note: { type: String }
});

const LoanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true                      // ⭐ Each loan belongs to one user
  },

  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },

  lender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },

  principal: {
    type: Number,
    required: true,
    min: 0
  },

  interestPercent: {
    type: Number,
    default: 0,
    min: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  dueDate: { type: Date },

  note: {
    type: String,
    trim: true
  },

  repayments: [RepaymentSchema],

  status: {
    type: String,
    enum: ['pending', 'cleared'],
    default: 'pending'
  }
});

// Helper function: compute outstanding
LoanSchema.methods.getOutstanding = function () {
  const principal = this.principal;
  const interest = (this.interestPercent || 0) * principal / 100;
  const total = principal + interest;

  const paid = (this.repayments || []).reduce((sum, r) => sum + r.amount, 0);
  const outstanding = Math.max(0, total - paid);

  return { total, paid, outstanding };
};

module.exports = mongoose.model('Loan', LoanSchema);
