const axios = require('axios');
const BASE =
  process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

async function getToken() {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');
  const r = await axios.get(`${BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  return r.data.access_token;
}

exports.stkPush = async ({ phone, amount, reference, description }) => {
  const token = await getToken();
  const ts = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${ts}`
  ).toString('base64');

  const r = await axios.post(
    `${BASE}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: ts,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: reference,
      TransactionDesc: description || 'InfieldHub Purchase',
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return r.data;
};