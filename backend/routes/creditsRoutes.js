import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/credits/:email -> returns { email, credits }
router.get('/:email', async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) return res.status(400).json({ error: 'Email required' });
    const user = await User.findOne({ email }).select('email credits');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ email: user.email, credits: user.credits || 0 });
  } catch (err) {
    console.error('Credits GET error:', err);
    return res.status(500).json({ error: 'Failed to fetch credits' });
  }
});

// POST /api/credits/redeem
// Body: { email: string, amount: number, reason?: string }
router.post('/redeem', async (req, res) => {
  try {
    const { email, amount } = req.body || {};
    const parsed = Number(amount || 0);
    if (!email) return res.status(400).json({ error: 'Email required' });
    if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
      return res.status(400).json({ error: 'Amount must be a positive integer' });
    }

    // Atomically decrement credits if enough balance exists
    const updated = await User.findOneAndUpdate(
      { email, credits: { $gte: parsed } },
      { $inc: { credits: -parsed } },
      { new: true }
    ).select('email credits');

    if (!updated) {
      // Could be user not found or insufficient funds
      const exists = await User.exists({ email });
      if (!exists) return res.status(404).json({ error: 'User not found' });
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    // Optionally, we could log a transaction collection here.
    return res.json({ success: true, email: updated.email, credits: updated.credits });
  } catch (err) {
    console.error('Credits redeem error:', err);
    return res.status(500).json({ error: 'Failed to redeem credits' });
  }
});

export default router;
