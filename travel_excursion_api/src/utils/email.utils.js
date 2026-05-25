const { sendMail } = require("../config/mailer");

const buildPasswordResetUrl = (resetToken) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5000";
  return `${baseUrl}/api/auth/reset-password?token=${resetToken}`;
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = buildPasswordResetUrl(resetToken);

  await sendMail({
    to: email,
    subject: "Password Reset Request",
    text: `You requested to reset your password. Use this link: ${resetUrl}. This link expires in 1 hour.`,
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset it. This link expires in 1 hour.</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });
};

const sendBookingConfirmationEmail = async (email, booking) => {
  const destination = booking.package?.excursion?.destination;
  const packageTitle = booking.package?.title || "Selected Package";
  const destinationName = destination
    ? `${destination.title}, ${destination.country}`
    : "Travel destination";

  await sendMail({
    to: email,
    subject: "Booking Confirmation — Travel & Excursion",
    text: `
Booking confirmed!

Booking ID: ${booking.id}
Destination: ${destinationName}
Package: ${packageTitle}
Participants: ${booking.participants}
Start Date: ${new Date(booking.startDate).toDateString()}
Total Price: $${booking.totalPrice}
Status: ${booking.status}
    `,
    html: `
      <h2>Booking Confirmed! 🎉</h2>
      <p>Your booking has been successfully created.</p>

      <table>
        <tr><td><strong>Booking ID:</strong></td><td>${booking.id}</td></tr>
        <tr><td><strong>Destination:</strong></td><td>${destinationName}</td></tr>
        <tr><td><strong>Package:</strong></td><td>${packageTitle}</td></tr>
        <tr><td><strong>Participants:</strong></td><td>${booking.participants}</td></tr>
        <tr><td><strong>Start Date:</strong></td><td>${new Date(booking.startDate).toDateString()}</td></tr>
        <tr><td><strong>Total Price:</strong></td><td>$${booking.totalPrice}</td></tr>
        <tr><td><strong>Status:</strong></td><td>${booking.status}</td></tr>
      </table>

      <p>Thank you for booking with us!</p>
    `,
  });
};

module.exports = {
  sendPasswordResetEmail,
  sendBookingConfirmationEmail,
};
