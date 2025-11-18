import User from "../models/User.js";

export const claimItem = async (req, res) => {
  try {
    const userId = req.body.userId; // or req.user.id if using JWT
    const itemId = req.body.itemId;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Set start & end of current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    // Filter claims made this month
    const monthlyClaims = user.claims.filter(
      (c) => c.claimedAt >= startOfMonth && c.claimedAt < endOfMonth
    );

    if (monthlyClaims.length >= 3) {
      return res.status(403).json({
        message: "Limit reached: You can only claim 3 items this month."
      });
    }

    // Add claim
    user.claims.push({ itemId });
    await user.save();

    res.status(200).json({ message: "Item claimed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
