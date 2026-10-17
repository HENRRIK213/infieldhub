function normalizePhone(phone) {
  const cleaned = String(phone || '').replace(/[^\d]/g, '');
  if (cleaned.startsWith('254')) return cleaned;
  if (cleaned.startsWith('0')) return '254' + cleaned.slice(1);
  if (cleaned.startsWith('7') || cleaned.startsWith('1')) return '254' + cleaned;
  return cleaned;
}

async function sendSMS(to, message) {
  const apiKey = process.env.LOOPING_API_KEY;
  const senderId = process.env.LOOPING_SENDER_ID || 'INFIELDHUB';
  const apiUrl = process.env.LOOPING_API_URL || 'https://api.looping.co.ke/v1/sms/send';
  const formatted = normalizePhone(to);

  if (!apiKey) {
    console.log('[SMS] (no LOOPING_API_KEY) would send to ' + formatted + ': ' + message);
    return { ok: false, reason: 'no-api-key' };
  }

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ to: formatted, message: message, sender_id: senderId }),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error('[SMS] Looping HTTP ' + res.status + ': ' + text);
      return { ok: false, status: res.status, body: text };
    }
    console.log('[SMS] Sent to ' + formatted);
    return { ok: true };
  } catch (err) {
    console.error('[SMS] Error: ' + err.message);
    return { ok: false, error: err.message };
  }
}

async function sendAdminSMS(message) {
  const adminPhone = process.env.ADMIN_PHONE || '0701243548';
  return sendSMS(adminPhone, message);
}

module.exports = { sendSMS, sendAdminSMS, normalizePhone };
