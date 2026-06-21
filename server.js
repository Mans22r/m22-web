const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "127.0.0.1";

app.use(express.json({ limit: "32kb" }));
app.use(express.static(__dirname));

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.post("/api/contact", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const message = String(req.body.message || "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  const requiredEnv = ["EMAIL_HOST", "EMAIL_PORT", "EMAIL_USER", "EMAIL_PASS"];
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);

  if (missingEnv.length) {
    return res.status(500).json({ message: "Email service is not configured." });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <h2>New portfolio message</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    res.json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Email send failed:", error);
    res.status(500).json({ message: "Message could not be sent. Please try again later." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, host, () => {
  console.log(`Portfolio site running at http://${host}:${port}`);
});
