// sendEmail.js
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// General reusable email function
export async function sendEmail(toEmail, subject, htmlContent) {
  const msg = {
    to: toEmail,
    from: process.env.SENDGRID_VERIFIED_SENDER,
    subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    if (error.response) console.error(error.response.body);
  }
}

// Existing verification function
export async function sendVerificationEmail(toEmail, code) {
  const msg = {
    to: toEmail,
    from: process.env.SENDGRID_VERIFIED_SENDER,
    subject: "Your Waste2Needs Verification Code",
    html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color:#16a34a;">Welcome to Waste2Needs 🌱</h2>
            <p>Use the code below to verify your email address:</p>
            <h1 style="color:#16a34a; letter-spacing:4px;">${code}</h1>
           </div>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Verification email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    if (error.response) console.error(error.response.body);
  }
}
