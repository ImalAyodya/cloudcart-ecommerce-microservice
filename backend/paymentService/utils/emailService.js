/**
 * Email Utility – sends payment receipt emails via Nodemailer
 *
 * Uses Gmail SMTP by default.  Set the following env vars:
 *   EMAIL_USER      – sender Gmail address
 *   EMAIL_PASSWORD   – Gmail App Password (NOT your regular password)
 *
 * Generate an App Password:
 *   Google Account → Security → 2-Step Verification → App passwords
 */

const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send a payment receipt email
 * @param {string} recipientEmail - customer email address
 * @param {object} paymentDetails - payment info to include in the email
 */
const sendPaymentReceiptEmail = async (recipientEmail, paymentDetails) => {
  const {
    orderId,
    transactionId,
    amount,
    paymentMethod,
    status,
    createdAt,
  } = paymentDetails;

  const statusColor = status === 'SUCCESS' ? '#10b981' : '#ef4444';
  const statusLabel = status === 'SUCCESS' ? 'Successful' : 'Failed';

  const mailOptions = {
    from: `"CloudCart" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: `Payment ${statusLabel} – Order ${orderId}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">CloudCart</h1>
          <p style="color: #e0f2fe; margin: 8px 0 0; font-size: 14px;">Payment Receipt</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          
          <!-- Status Badge -->
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="display: inline-block; background: ${statusColor}; color: #fff; padding: 8px 24px; border-radius: 50px; font-weight: 600; font-size: 14px;">
              Payment ${statusLabel}
            </span>
          </div>

          <!-- Amount -->
          <div style="text-align: center; margin-bottom: 32px;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">Amount Paid</p>
            <p style="color: #0f172a; font-size: 36px; font-weight: 700; margin: 8px 0;">
              Rs. ${Number(amount).toLocaleString()}
            </p>
          </div>

          <!-- Details Table -->
          <div style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 14px 20px; color: #64748b; font-size: 14px;">Order ID</td>
                <td style="padding: 14px 20px; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right; font-family: monospace;">${orderId}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 14px 20px; color: #64748b; font-size: 14px;">Transaction ID</td>
                <td style="padding: 14px 20px; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right; font-family: monospace;">${transactionId}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 14px 20px; color: #64748b; font-size: 14px;">Payment Method</td>
                <td style="padding: 14px 20px; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding: 14px 20px; color: #64748b; font-size: 14px;">Date</td>
                <td style="padding: 14px 20px; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${new Date(createdAt).toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <!-- Footer Note -->
          <div style="margin-top: 32px; padding: 16px; background: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd;">
            <p style="color: #0369a1; font-size: 13px; margin: 0; line-height: 1.5;">
              This is an automated receipt from CloudCart. If you did not make this payment, please contact our support team immediately.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f1f5f9; padding: 20px; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            &copy; ${new Date().getFullYear()} CloudCart. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Payment receipt email sent to ${recipientEmail} — Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send email to ${recipientEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendPaymentReceiptEmail };
