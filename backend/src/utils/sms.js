require('dotenv').config();
const AfricasTalking = require('africastalking');
let sms = null;
if (process.env.AT_API_KEY && process.env.AT_USERNAME) {
  try {
    const africastalking = AfricasTalking({ apiKey: process.env.AT_API_KEY, username: process.env.AT_USERNAME });
    sms = africastalking.SMS;
  } catch (error) { console.error('SMS Init Failed:', error.message); }
}
const sendAdminAlert = async (message) => {
  if (!sms) return console.log('⚠️ SMS keys missing, skipping alert.');
  try {
    await sms.send({ to: [process.env.ADMIN_PHONE_NUMBER || '+254701243548'], message });
    console.log('✅ SMS Sent');
  } catch (error) { console.error('❌ SMS Failed:', error.message); }
};
module.exports = { sendAdminAlert };
