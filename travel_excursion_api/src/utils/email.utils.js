const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `http://localhost:5000/api/auth/reset-password?token=${resetToken}`;

  if (process.env.NODE_ENV === "development") {
    console.log("─────────────────────────────────────");
    console.log("📧 PASSWORD RESET EMAIL");
    console.log(`To: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token: ${resetToken}`);
    console.log("─────────────────────────────────────");
    return;
  }

  // In production I will send this function to send real Email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it. This link expires in 1 hour.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });
};

module.exports = { sendPasswordResetEmail };

// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// const sendPasswordResetEmail = async (email, resetToken) => {
//   const resetUrl = `http://localhost:5000/api/auth/reset-password?token=${resetToken}`;

//   if (process.env.NODE_ENV === "development") {
//     console.log("─────────────────────────────────────");
//     console.log("📧 PASSWORD RESET EMAIL");
//     console.log(`To: ${email}`);
//     console.log(`Reset URL: ${resetUrl}`);
//     console.log(`Token: ${resetToken}`);
//     console.log("─────────────────────────────────────");
//     return;
//   }

//   await transporter.sendMail({
//     from: process.env.EMAIL_FROM,
//     to: email,
//     subject: "Password Reset Request",
//     html: `
//       <h2>Password Reset Request</h2>
//       <p>Click the link below to reset your password. Expires in 1 hour.</p>
//       <a href="${resetUrl}">Reset Password</a>
//     `,
//   });
// };

const sendBookingConfirmationEmail = async (email, booking) => {
  if (process.env.NODE_ENV === "development") {
    console.log("─────────────────────────────────────");
    console.log("📧 BOOKING CONFIRMATION EMAIL");
    console.log(`To: ${email}`);
    console.log(`Booking ID: ${booking.id}`);
    console.log(`Package: ${booking.package.title}`);
    console.log(`Participants: ${booking.participants}`);
    console.log(`Start Date: ${booking.startDate}`);
    console.log(`Total Price: $${booking.totalPrice}`);
    console.log(`Status: ${booking.status}`);
    console.log("─────────────────────────────────────");
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Booking Confirmation — Travel & Excursion",
    html: `
      <h2>Booking Confirmed! 🎉</h2>
      <p>Your booking has been successfully created.</p>
      <table>
        <tr><td><strong>Booking ID:</strong></td><td>${booking.id}</td></tr>
        <tr><td><strong>Package:</strong></td><td>${booking.package.title}</td></tr>
        <tr><td><strong>Participants:</strong></td><td>${booking.participants}</td></tr>
        <tr><td><strong>Start Date:</strong></td><td>${new Date(booking.startDate).toDateString()}</td></tr>
        <tr><td><strong>Total Price:</strong></td><td>$${booking.totalPrice}</td></tr>
        <tr><td><strong>Status:</strong></td><td>${booking.status}</td></tr>
      </table>
      <p>Thank you for booking with us!</p>
    `,
  });
};

module.exports = { sendPasswordResetEmail, sendBookingConfirmationEmail };