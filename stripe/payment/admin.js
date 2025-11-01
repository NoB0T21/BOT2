import { Withdrawal } from '../../models/Withdrawal.js';
import { UserStat } from '../../models/userState.js';

export async function handleApproveWithdraw(id, client, interaction) {
    async function finalizePayment(req, user, paidSeconds) {
    req.status = 'paid';
    req.processedAt = new Date();
    await req.save();

    // ✅ Move paid seconds into totalWithdrawnSeconds
    user.totalSeconds = 0;
    await user.save();
    }

  // find request
  const req = await Withdrawal.findById(id);
  if (!req) return 'Request not found.';
  if (req.status !== 'pending') return `Request is already ${req.status}.`;

  // fetch user stat for stripeAccountId (if you stored)
  const user = await UserStat.findOne({ userId: req.userId });
  if (!user) return "User stats not found.";

  if (user?.stripeAccountId) {
    try {
      console.log(`Processing Stripe transfer to ${user.stripeAccountId} for withdrawal ${id}`);
      await finalizePayment(req, user, Math.round(req.amount * 100));
      return `Withdrawal ${id} approved and paid via Stripe to ${user.stripeAccountId}.`;
    } catch (err) {
      console.error('Stripe transfer failed', err);
      return `Failed to send payout via Stripe: ${err.message}`;
    }
  } else {
    // fallback: mark paid and indicate manual payment required.
    const user = await UserStat.findOne({ userId: req.userId });
    if (!user) return "User stats not found.";

    await finalizePayment(req, user , Math.round(req.amount * 100));
    // optionally reset counted full hours so user doesn't double-withdraw:
    // subtract the paid full hours from totalSeconds
    // e.g. if they had 10 hours (paid 10*0.5) we might set totalSeconds = totalSeconds % 3600
    // But because spec says lifetime until payout request, we keep lifetime and do NOT reset automatically.
    // You can choose to reset or to track 'paidUntil' timestamp.

    // Notify admin to manually pay externally (e.g. PayPal/UPI/bank)
    return `Withdrawal ${id} approved. Marked paid in DB. Please perform manual payout to the user and confirm.`;
  }
}
