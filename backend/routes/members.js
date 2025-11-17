const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Loan = require('../models/Loan');
const auth = require('../middleware/authMiddleware');

router.use(auth);

// GET member list (only current user)
router.get('/', async (req, res, next) => {
  try {
    const members = await Member.find({ userId: req.user.id }).lean();
    const loans = await Loan.find({ userId: req.user.id }).lean();

    const map = {};
    members.forEach(m => map[m._id] = { incoming: 0, outgoing: 0 });

    for (const l of loans) {
      const interest = (l.interestPercent || 0) * l.principal / 100;
      const total = l.principal + interest;
      const paid = (l.repayments || []).reduce((s, r) => s + r.amount, 0);
      const outstanding = Math.max(0, total - paid);

      if (map[l.lender]) map[l.lender].incoming += outstanding;
      if (map[l.borrower]) map[l.borrower].outgoing += outstanding;
    }

    const enriched = members.map(m => ({
      ...m,
      incoming: map[m._id]?.incoming || 0,
      outgoing: map[m._id]?.outgoing || 0,
      netBalance: (map[m._id]?.incoming || 0) - (map[m._id]?.outgoing || 0)
    }));

    res.json(enriched);
  } catch (err) { next(err); }
});

// POST create
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const member = new Member({
      userId: req.user.id,
      name,
      email,
      phone
    });

    await member.save();
    res.status(201).json(member);
  } catch (err) { next(err); }
});

// PUT update
router.put('/:id', async (req, res, next) => {
  try {
    const member = await Member.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!member) return res.status(404).json({ error: "Member not found" });

    res.json(member);
  } catch (err) { next(err); }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    const pending = await Loan.findOne({
      userId: req.user.id,
      status: "pending",
      $or: [{ borrower: req.params.id }, { lender: req.params.id }]
    });

    if (pending)
      return res.status(400).json({ error: "Cannot delete member with pending loans" });

    const deleted = await Member.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deleted)
      return res.status(404).json({ error: "Member not found" });

    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
