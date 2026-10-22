import nodemailer from 'nodemailer';

// Helper to sanitize and obtain email/SMTP configuration from environment variables
export const getEmailConfig = () => {
  const service = process.env.SMTP_SERVICE?.trim().toLowerCase();
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || process.env.SMTP_EMAIL || process.env.EMAIL_USERNAME || '').trim();
  // App passwords often have spaces like "vurh wdtf kocn yehj" which need to be removed or preserved
  const rawPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD || '';
  const pass = rawPass.replace(/\s+/g, '').trim();

  const fromName = process.env.SMTP_FROM_NAME || 'Wellora NutriFlow';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.EMAIL_FROM || process.env.SMTP_FROM || user || 'noreply@wellora.com';
  const from = `"${fromName}" <${fromEmail}>`;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return { service, host, port, user, pass, from, secure };
};

// Create reusable transporter
export const createEmailTransporter = () => {
  const config = getEmailConfig();

  if (!config.user || !config.pass) {
    return null;
  }

  // If service is gmail or host is smtp.gmail.com
  if (config.service === 'gmail' || config.host.includes('gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Generate a strict 6-digit numeric OTP string (100000 to 999999)
 */
export const generate6DigitOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send 6-digit OTP verification email to user
 */
export const sendOtpEmail = async (toEmail: string, otp: string, recipientName: string = 'User') => {
  const config = getEmailConfig();
  const transporter = createEmailTransporter();

  const subject = `Your Wellora Verification Code: ${otp}`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
          .content { padding: 32px 28px; }
          .otp-badge { background: #f0fdf4; border: 2px dashed #10b981; border-radius: 12px; padding: 18px 24px; text-align: center; margin: 24px 0; }
          .otp-code { font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #059669; font-family: monospace; }
          .footer { padding: 20px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Wellora NutriFlow AI</h1>
          </div>
          <div class="content">
            <h2 style="margin-top: 0; color: #0f172a; font-size: 20px;">Email Verification</h2>
            <p style="font-size: 15px; color: #334155; line-height: 1.5;">Hello <strong>${recipientName}</strong>,</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.5;">
              Use the 6-digit verification code below to verify your email address. This code is valid for <strong>5 minutes</strong>.
            </p>
            <div class="otp-badge">
              <div class="otp-code">${otp}</div>
            </div>
            <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
              If you didn't request this verification code, you can safely ignore this email. Never share your OTP with anyone.
            </p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Wellora NutriFlow AI. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  if (!transporter) {
    console.warn('⚠️ [EMAIL SERVICE] SMTP credentials not fully configured in .env (SMTP_USER / SMTP_PASS).');
    console.log(`\n==============================================`);
    console.log(`📧 [EMAIL OTP SIMULATION]`);
    console.log(`   To Email         : ${toEmail}`);
    console.log(`   Verification OTP : ${otp}`);
    console.log(`   Valid For        : 5 Minutes`);
    console.log(`==============================================\n`);
    return {
      sent: false,
      simulated: true,
      message: 'SMTP credentials missing in .env. OTP displayed in terminal.',
    };
  }

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to: toEmail,
      subject,
      text: `Your Wellora 6-digit verification code is: ${otp}. Valid for 5 minutes.`,
      html: htmlContent,
    });

    console.log(`\n==============================================`);
    console.log(`📧 [EMAIL OTP SENT VIA SMTP/NODEMAILER]`);
    console.log(`   To Email         : ${toEmail}`);
    console.log(`   Verification OTP : ${otp}`);
    console.log(`   Message ID       : ${info.messageId}`);
    console.log(`==============================================\n`);

    return {
      sent: true,
      simulated: false,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('❌ [EMAIL SERVICE ERROR] Failed to send email via SMTP:', error.message);
    throw error;
  }
};
