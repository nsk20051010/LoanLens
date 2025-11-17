const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const Member = require('../models/Member');
const auth = require('../middleware/authMiddleware');

router.use(auth);

// GET all loans for the logged-in user
router.get('/', async (req, res, next) => {
  try {
    const loans = await Loan.find({ userId: req.user.id })
      .populate("borrower lender")
      .sort({ createdAt: -1 });

    const enriched = loans.map(l => ({
      ...l.toObject(),
      ...l.getOutstanding()
    }));

    res.json(enriched);
  } catch (err) { next(err); }
});

// GET single loan
router.get('/:id', async (req, res, next) => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate("borrower lender");

    if (!loan) return res.status(404).json({ error: "Loan not found" });

    res.json({ ...loan.toObject(), ...loan.getOutstanding() });
  } catch (err) { next(err); }
});

// POST create loan
router.post('/', async (req, res, next) => {
  try {
    const { borrowerId, lenderId, principal, interestPercent, dueDate, note } = req.body;

    const loan = new Loan({
      userId: req.user.id, // << NEW
      borrower: borrowerId,
      lender: lenderId,
      principal,
      interestPercent,
      dueDate,
      note
    });

    await loan.save();

    const populated = await Loan.findById(loan._id).populate("borrower lender");

    res.status(201).json(populated);
  } catch (err) { next(err); }
});

// PUT update or repayment
router.put('/:id', async (req, res, next) => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!loan) return res.status(404).json({ error: "Loan not found" });

    const { action } = req.query;

    // ADD REPAYMENT
    if (action === "repay") {
      const amt = Number(req.body.amount);

      const { total, paid, outstanding } = loan.getOutstanding();

      if (amt > outstanding)
        return res.status(400).json({ error: "Repayment exceeds outstanding" });

      loan.repayments.push({ amount: amt, note: req.body.note });

      if (total - (paid + amt) <= 0) loan.status = "cleared";

      await loan.save();

      const populated = await Loan.findById(loan._id).populate("borrower lender");

      return res.json({ ...populated.toObject(), ...populated.getOutstanding() });
    }

    // GENERAL UPDATE
    Object.assign(loan, req.body);
    await loan.save();

    const populated = await Loan.findById(loan._id).populate("borrower lender");

    res.json(populated);
  } catch (err) { next(err); }
});

// DELETE loan
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Loan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deleted)
      return res.status(404).json({ error: "Loan not found" });

    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
