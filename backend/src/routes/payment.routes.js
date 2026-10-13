const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { v4: uuid } = require('uuid');
const router = express.Router();
const prisma = new PrismaClient();
const { auth, requireAdmin } = require('../middleware/auth');
const { stkPush } = require('../utils/mpesa');
const { logActivity, createAlert } = require('../utils/security');
const { sendPaymentConfirmation } = require('../utils/mailer');

router.post('/initiate', async (req, res) => {
  try {
    const { phone, amount, quotationId, email } = req.body;
    const reference = `INFH-${uuid().slice(0, 8).toUpperCase()}`;
    const payment = await prisma.payment.create({
      data: { customerPhone: phone, amount, quotationId, reference, status: 'PENDING' },
    });

    let stkResponse = null;
    try {
      stkResponse = await stkPush({
        phone,
        amount,
        reference,
        description: 'InfieldHub Purchase',
      });
      if (stkResponse?.CheckoutRequestID) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { reference: stkResponse.CheckoutRequestID },
        });
      }
    } catch (e) {
      console.error('STK:', e.response?.data || e.message);
      await createAlert('PAYMENT_INIT_FAILED', `STK failed for ${phone}`, 'MEDIUM');
    }

    await logActivity({
      action: 'PAYMENT_INIT',
      interface: 'customer',
      details: `${reference} KES ${amount}`,
      ip: req.ip,
    });
    res.json({ payment, stkResponse });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/callback', async (req, res) => {
  try {
    const cb = req.body?.Body?.stkCallback;
    if (!cb) return res.json({ ok: true });
    const payment = await prisma.payment.findFirst({ where: { reference: cb.CheckoutRequestID } });
    if (payment) {
      const receipt = cb.CallbackMetadata?.Item?.find(
        (i) => i.Name === 'MpesaReceiptNumber'
      )?.Value;
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: cb.ResultCode === 0 ? 'AWAITING_APPROVAL' : 'FAILED',
          mpesaReceipt: receipt || null,
        },
      });
      req.app
        .get('io')
        .to('admin-room')
        .emit('payment:received', { reference: payment.reference, receipt });
    }
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.json({ ok: true });
  }
});

router.get('/', auth, requireAdmin, async (req, res) => {
  res.json(await prisma.payment.findMany({ orderBy: { createdAt: 'desc' } }));
});

router.put('/:id/approve', auth, requireAdmin, async (req, res) => {
  const p = await prisma.payment.update({
    where: { id: req.params.id },
    data: { status: 'APPROVED', approvedBy: req.user.id },
  });
  if (p.quotationId) {
    const q = await prisma.quotation.findUnique({ where: { id: p.quotationId } });
    if (q?.customerEmail) {
      await sendPaymentConfirmation(q.customerEmail, {
        reference: p.reference,
        amount: p.amount,
        items: (q.items || []).map((i) => i.name).join(', '),
      });
    }
  }
  req.app.get('io').to('admin-room').emit('payment:approved', p);
  await logActivity({
    userId: req.user.id,
    action: 'PAYMENT_APPROVE',
    interface: 'web',
    details: p.reference,
    ip: req.ip,
  });
  res.json(p);
});

module.exports = router;