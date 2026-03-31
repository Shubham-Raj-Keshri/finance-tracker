const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Transaction = require("../models/Transaction");
const auth = require("../middleware/authMiddleware");

// SUMMARY
router.get("/summary", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user });
    let income = 0, expense = 0;
    transactions.forEach(t => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });
    res.json({ income, expense, balance: income - expense });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// INSIGHTS — category breakdown with optional date range
router.get("/insights", auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = { user: new mongoose.Types.ObjectId(req.user) };
    if (startDate && endDate)
      match.date = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const data = await Transaction.aggregate([
      { $match: match },
      { $group: { _id: { type: "$type", category: "$category" }, total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]);
    res.json(data);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// GET with filters
router.get("/", auth, async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    const query = { user: req.user };
    if (type) query.type = type;
    if (category) query.category = { $regex: category, $options: "i" };
    if (startDate && endDate)
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ADD
router.post("/", auth, async (req, res) => {
  try {
    const { amount, category, type, note, date } = req.body;
    if (!amount || !category || !type)
      return res.status(400).json({ message: "amount, category and type are required" });

    const t = await new Transaction({ amount, category, type, note, date, user: req.user }).save();
    res.json(t);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE — ownership enforced
router.put("/:id", auth, async (req, res) => {
  try {
    const t = await Transaction.findOne({ _id: req.params.id, user: req.user });
    if (!t) return res.status(404).json({ message: "Transaction not found" });

    const { amount, category, type, note, date } = req.body;
    if (amount !== undefined) t.amount = amount;
    if (category !== undefined) t.category = category;
    if (type !== undefined) t.type = type;
    if (note !== undefined) t.note = note;
    if (date !== undefined) t.date = date;

    await t.save();
    res.json(t);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE — ownership enforced
router.delete("/:id", auth, async (req, res) => {
  try {
    const t = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!t) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;