const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { sendAdminAlert } = require('../utils/sms');
const prisma = new PrismaClient();

// POST /api/sms/webhook
router.post('/webhook', async (req, res) => {
  try {
    // Africa's Talking sends data as URL-encoded form data
    const { from, text } = req.body;
    const command = text ? text.trim() : '';

    console.log(`📩 Received SMS from ${from}: "${command}"`);

    // SECURITY: Ensure only the Admin can run commands
    if (from !== process.env.ADMIN_PHONE_NUMBER && from !== process.env.ADMIN_PHONE_NUMBER.replace('+', '')) {
      return res.status(403).send('Unauthorized');
    }

    // Find the most recent pending approval
    const pending = await prisma.pendingApproval.findFirst({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' }
    });

    if (!pending) {
      await sendAdminAlert("⚠️ No pending approvals found.");
      return res.status(200).send('No pending approvals');
    }

    if (command === '1') {
      // Approve
      await prisma.pendingApproval.update({
        where: { id: pending.id },
        data: { status: 'APPROVED' }
      });
      await sendAdminAlert(`✅ Approved: ${pending.description}`);
      console.log('Payment Approved via SMS');

    } else if (command === '2') {
      // Reject
      await prisma.pendingApproval.update({
        where: { id: pending.id },
        data: { status: 'REJECTED' }
      });
      await sendAdminAlert(`❌ Rejected: ${pending.description}`);
      console.log('Payment Rejected via SMS');

    } else {
      await sendAdminAlert("❓ Invalid command. Reply 1 to Approve or 2 to Reject.");
    }

    res.status(200).send('Processed');
  } catch (error) {
    console.error('SMS Webhook Error:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
