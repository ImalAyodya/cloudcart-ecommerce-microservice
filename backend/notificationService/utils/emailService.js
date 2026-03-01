/**
 * Email Service
 * 
 * Centralized email utility using Nodemailer for sending various types of emails.
 * 
 * Configuration:
 *   EMAIL_USER      – sender Gmail address
 *   EMAIL_PASSWORD  – Gmail App Password (NOT your regular password)
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

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service configuration error:', error.message);
  } else {
    console.log('✅ Email service is ready to send messages');
  }
});

/**
 * Send a generic email
 * @param {object} options - Email options { to, subject, html, text }
 */
const sendGenericEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `"CloudCart" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: html || undefined,
      text: text || undefined,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    throw error;
  }
};

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
          <p style="color: #e0f2fe; margin: 8px 0 0; font-size: 14px;">E-Commerce Platform</p>
        </div>

        <!-- Status Badge -->
        <div style="padding: 24px; text-align: center;">
          <div style="display: inline-block; background: ${statusColor}; color: white; padding: 12px 24px; border-radius: 24px; font-weight: 600; font-size: 16px;">
            Payment ${statusLabel}
          </div>
        </div>

        <!-- Payment Details -->
        <div style="padding: 0 24px 24px;">
          <div style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">
              Payment Receipt
            </h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Order ID</td>
                <td style="padding: 10px 0; color: #1e293b; font-weight: 600; text-align: right;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Transaction ID</td>
                <td style="padding: 10px 0; color: #1e293b; font-weight: 600; text-align: right;">${transactionId}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Amount</td>
                <td style="padding: 10px 0; color: #1e293b; font-weight: 600; text-align: right; font-size: 18px;">$${amount}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Payment Method</td>
                <td style="padding: 10px 0; color: #1e293b; font-weight: 600; text-align: right;">${paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Date</td>
                <td style="padding: 10px 0; color: #1e293b; font-weight: 600; text-align: right;">${new Date(createdAt).toLocaleString()}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 24px; background: #f1f5f9; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #64748b; font-size: 12px;">
            Thank you for shopping with CloudCart!
          </p>
          <p style="margin: 8px 0 0; color: #94a3b8; font-size: 11px;">
            This is an automated message, please do not reply.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Payment receipt sent to ${recipientEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send payment receipt to ${recipientEmail}:`, error.message);
    throw error;
  }
};

/**
 * Send order confirmation email
 * @param {string} recipientEmail - customer email address
 * @param {object} orderDetails - order information
 */
const sendOrderConfirmationEmail = async (recipientEmail, orderDetails) => {
  const {
    orderId,
    items = [],
    totalAmount,
    shippingAddress,
    createdAt,
  } = orderDetails;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${item.price}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"CloudCart" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: `Order Confirmation – Order #${orderId}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Order Confirmed! 🎉</h1>
          <p style="color: #d1fae5; margin: 8px 0 0;">Thank you for your purchase</p>
        </div>

        <!-- Order Details -->
        <div style="padding: 24px;">
          <div style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 18px;">Order #${orderId}</h2>
            <p style="color: #64748b; font-size: 14px; margin: 0 0 16px;">Placed on ${new Date(createdAt).toLocaleDateString()}</p>
            
            ${items.length > 0 ? `
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <thead>
                  <tr style="background: #f1f5f9;">
                    <th style="padding: 12px; text-align: left; color: #475569;">Item</th>
                    <th style="padding: 12px; text-align: center; color: #475569;">Qty</th>
                    <th style="padding: 12px; text-align: right; color: #475569;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr>
                    <td colspan="2" style="padding: 16px 12px 12px; font-weight: 600; color: #1e293b;">Total</td>
                    <td style="padding: 16px 12px 12px; text-align: right; font-weight: 600; color: #10b981; font-size: 18px;">$${totalAmount}</td>
                  </tr>
                </tbody>
              </table>
            ` : ''}

            ${shippingAddress ? `
              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                <h3 style="margin: 0 0 12px; color: #1e293b; font-size: 16px;">Shipping Address</h3>
                <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">${shippingAddress}</p>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 24px; text-align: center; color: #64748b; font-size: 12px;">
          <p>Questions? Contact us at support@cloudcart.com</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation sent to ${recipientEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send order confirmation to ${recipientEmail}:`, error.message);
    throw error;
  }
};

/**
 * Send welcome email to new users
 * @param {string} recipientEmail - new user's email
 * @param {string} userName - user's name
 */
const sendWelcomeEmail = async (recipientEmail, userName) => {
  const mailOptions = {
    from: `"CloudCart" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: 'Welcome to CloudCart! 🎉',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to CloudCart! 🎉</h1>
        </div>

        <!-- Content -->
        <div style="padding: 32px; background: white;">
          <h2 style="color: #1e293b; margin: 0 0 16px;">Hi ${userName}!</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
            Thank you for joining CloudCart! We're excited to have you as part of our community.
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Get started by browsing our amazing collection of products and enjoy a seamless shopping experience.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="http://localhost:5173/products" style="background: #8b5cf6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Start Shopping
            </a>
          </div>

          <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; margin-top: 24px;">
            <h3 style="color: #1e293b; margin: 0 0 12px; font-size: 16px;">Quick Tips:</h3>
            <ul style="color: #475569; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Browse our latest products and deals</li>
              <li>Add items to your cart for easy checkout</li>
              <li>Track your orders in real-time</li>
              <li>Enjoy secure payment options</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 24px; text-align: center; background: #f8fafc; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">Need help? Contact us at support@cloudcart.com</p>
          <p style="margin: 8px 0 0;">© 2026 CloudCart. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${recipientEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${recipientEmail}:`, error.message);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} recipientEmail - user's email
 * @param {string} resetLink - password reset link or token
 */
const sendPasswordResetEmail = async (recipientEmail, resetLink) => {
  const mailOptions = {
    from: `"CloudCart" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: 'Reset Your Password – CloudCart',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Password Reset Request</h1>
        </div>

        <!-- Content -->
        <div style="padding: 32px; background: white;">
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
            We received a request to reset your password. Click the button below to create a new password:
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetLink}" style="background: #ef4444; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Reset Password
            </a>
          </div>

          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">
            Or copy and paste this link into your browser:<br>
            <a href="${resetLink}" style="color: #0ea5e9; word-break: break-all;">${resetLink}</a>
          </p>

          <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin-top: 24px;">
            <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.6;">
              <strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </p>
          </div>

          <p style="color: #94a3b8; font-size: 12px; margin: 24px 0 0;">
            This link will expire in 1 hour for security reasons.
          </p>
        </div>

        <!-- Footer -->
        <div style="padding: 24px; text-align: center; background: #f8fafc; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">CloudCart Security Team</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${recipientEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send password reset email to ${recipientEmail}:`, error.message);
    throw error;
  }
};

module.exports = {
  sendGenericEmail,
  sendPaymentReceiptEmail,
  sendOrderConfirmationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};
