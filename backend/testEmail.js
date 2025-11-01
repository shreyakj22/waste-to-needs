// testEmail.js
import { sendVerificationEmail } from "./sendEmail.js";

const test = async () => {
  console.log("📨 Sending test email...");
  const code = Math.floor(100000 + Math.random() * 900000);
  await sendVerificationEmail("waste2need@gmail.com");
  console.log("✅ Done!");
};

test();