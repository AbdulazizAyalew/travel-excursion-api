const nodemailer = require("nodemailer");

const isDevelopment = process.env.NODE_ENV === "development";

const isSmtpConfigured =
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS;

let transporter = null;

if (!isDevelopment && isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const sendMail = async ({ to, subject, html, text }) => {
  if (isDevelopment || !isSmtpConfigured) {
    console.log("─────────────────────────────────────");
    console.log("📧 EMAIL LOGGED");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    if (text) console.log(`Text: ${text}`);
    if (html) console.log(`HTML: ${html}`);
    console.log("─────────────────────────────────────");
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};

module.exports = { sendMail };
