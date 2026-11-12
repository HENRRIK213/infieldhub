const AfricasTalking = require('africastalking');

// Initialize Africa's Talking with keys from .env
const africastalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const sms = africastalking.SMS;

/**
 * Send an SMS to the Admin
 * @param {string} message - The text message to send
 */
const sendAdminAlert = async (message) => {
  try {
    const options = {
      to: [process.env.ADMIN_PHONE_NUMBER],
      message: message,
      // from: 'INFIELD' // Uncomment if you register a Sender ID on AT
    };
    
    const response = await sms.send(options);
    console.log('✅ SMS Sent to Admin:', response);
    return response;
  } catch (error) {
    console.error('❌ Failed to send SMS:', error);
  }
};

module.exports = { sendAdminAlert };
