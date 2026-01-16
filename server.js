require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const blogRoutes = require("./routes/blogRoutes");
const adminRoutes = require("./routes/adminRoutes");
const fetch = require("node-fetch");
const https = require("https");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const path = require("path");
const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      return callback(null, true); // allow ALL origins & ports
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.json()); 
app.use(cookieParser());

app.get("/", async (req, res) => {
  return res.json({ success: true, message: "site is running......" });
});

app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);

app.post("/paaji/send-mail", async (req, res) => {
  const {
    fname,
    lname,
    email,
    phone,
    company,
    website,
    business,
    service,
    message,
    recaptchaToken,
  } = req.body;

  try {
    // ─────────── reCAPTCHA VERIFY ───────────
    const recaptchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY_PAAJI,
        response: recaptchaToken,
      })
    );

    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ error: "reCAPTCHA verification failed." });
    }

    // ─────────── EMAIL ───────────
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `Digital Paaji <${process.env.EMAIL}>`,
      to: process.env.receiverEMAIL,
      subject: `Digital Paaji New Contact Form Submission from ${fname}`,
      html: `
    <div style="font-family: Arial, sans-serif; background: #FAF8EA; padding: 20px; margin: 0;">

  <!-- Card Wrapper -->
  <div style="
    max-width: 600px;
    background: #ffffff;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #e5e5e5;
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  ">

    <!-- Title -->
    <h2 style="
      text-align: center;
      color: #B67032;
      font-size: 22px;
      margin-bottom: 20px;
    ">
      New Contact Form Submission
    </h2>

    <!-- First Name -->
    <div style="margin-bottom: 16px;">
      <strong style="color:#333; font-size:15px;">First Name:</strong>
      <p style="
        margin:6px 0 0;
        background:#fafafa;
        padding:10px;
        border-radius:6px;
        color:#555;
        word-wrap: break-word;
        overflow-wrap: break-word;
      ">${fname}</p>
    </div>

    <!-- Last Name -->
    <div style="margin-bottom: 16px;">
      <strong style="color:#333; font-size:15px;">Last Name:</strong>
      <p style="
        margin:6px 0 0;
        background:#fafafa;
        padding:10px;
        border-radius:6px;
        color:#555;
      ">${lname}</p>
    </div>

    <!-- Email -->
    <div style="margin-bottom: 16px;">
      <strong style="color:#333; font-size:15px;">Email:</strong>
      <p style="
        margin:6px 0 0;
        background:#fafafa;
        padding:10px;
        border-radius:6px;
        word-break: break-all;
      ">
        <a href="mailto:${email}" style="color:#B67032; text-decoration:none;">
          ${email}
        </a>
      </p>
    </div>

    <!-- Phone -->
    <div style="margin-bottom: 16px;">
      <strong style="color:#333; font-size:15px;">Phone:</strong>
      <p style="
        margin:6px 0 0;
        background:#fafafa;
        padding:10px;
        border-radius:6px;
      ">${phone}</p>
    </div>

    <!-- Company -->
    <div style="margin-bottom: 16px;">
      <strong style="color:#333; font-size:15px;">Company:</strong>
      <p style="
        margin:6px 0 0;
        background:#fafafa;
        padding:10px;
        border-radius:6px;
      ">${company}</p>
    </div>

    <!-- Business -->
    <div style="margin-bottom: 16px;">
      <strong style="color:#333; font-size:15px;">Business:</strong>
      <p style="
        margin:6px 0 0;
        background:#fafafa;
        padding:10px;
        border-radius:6px;
      ">${business}</p>
    </div>

    <!-- Website -->
    <div style="margin-bottom: 16px;">
      <strong style="color:#333; font-size:15px;">Website:</strong>
      <p style="
        margin:6px 0 0;
        background:#fafafa;
        padding:10px;
        border-radius:6px;
        word-break: break-all;
      ">
        <a href="${website}" target="_blank" style="color:#B67032; text-decoration:none;">
          ${website}
        </a>
      </p>
    </div>

    <!-- Service -->
    <div style="margin-bottom: 16px;">
      <strong style="color:#333; font-size:15px;">Service:</strong>
      <p style="
        margin:6px 0 0;
        background:#fafafa;
        padding:10px;
        border-radius:6px;
      ">${service}</p>
    </div>

    <!-- Message -->
    <div style="margin-bottom: 16px;">
      <strong style="color:#333; font-size:15px;">Message:</strong>
      <p style="
        margin:6px 0 0;
        background:#fafafa;
        padding:10px;
        border-radius:6px;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: break-word;
      ">${message}</p>
    </div>

    <!-- Footer -->
    <div style="text-align:center; margin-top:25px;">
      <p style="color:#B67032; font-weight:bold; font-size:15px; margin:0;">
        Digital Paaji
      </p>
      <p style="color:#999; font-size:12px; margin-top:4px;">
        Digital Marketing Agency • Patiala
      </p>
    </div>

  </div>
</div>
`,
    });

    // ─────────── WHATSAPP ───────────
    await axios.post(
      "https://console.authkey.io/restapi/requestjson.php",
      {
        country_code: "91",
        mobile: phone,
        wid: "19455",
        type: "interactive",
        template_name: "paajiwebsite",
        language: { policy: "deterministic", code: "en" },
        bodyValues: { 1: fname },
      },
      {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        headers: {
          Authorization: `Basic ${process.env.AUTHKEY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res
      .status(200)
      .json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Paaji Error:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to send message. Try again later." });
  }
});





app.post("/academy/send-mail", async (req, res) => {
  const {
    name,
    email,
    phone,
    qualification,
    interest,
    hear,
    message,
    recaptchaToken,
  } = req.body;

  // =============================
  // RECAPTCHA VERIFICATION
  // =============================
  try {
    const recaptchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY_ACADMEY,
        response: recaptchaToken,
      })
    );

    if (!recaptchaResponse.data.success) {
      return res.status(400).json({
        error: "reCAPTCHA verification failed.",
      });
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error.message);
    return res.status(500).json({
      error: "Failed to verify reCAPTCHA.",
    });
  }

  // =============================
  // EMAIL + WHATSAPP
  // =============================
  try {
    // Nodemailer Transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // Email Options
    const mailOptions = {
      from: `Digital Paaji Academy <${process.env.EMAIL}>`,
      to: process.env.receiverEMAIL,
      subject: `Digital Paaji Academy New Contact Form Submission from ${name}`,
      html: `
<div style="font-family: Arial, sans-serif; background: #FAF8EA; padding: 20px; margin: 0;">
  <div style="
    max-width: 600px;
    background: #ffffff;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #e5e5e5;
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  ">

    <h2 style="
      text-align: center;
      color: #B67032;
      font-size: 22px;
      margin-bottom: 20px;
    ">
      New Contact Form Submission
    </h2>

    <div style="margin-bottom:16px;">
      <strong>Name:</strong>
      <p style="background:#fafafa;padding:10px;border-radius:6px;">${name}</p>
    </div>

    <div style="margin-bottom:16px;">
      <strong>Email:</strong>
      <p style="background:#fafafa;padding:10px;border-radius:6px;">
        <a href="mailto:${email}" style="color:#B67032;text-decoration:none;">
          ${email}
        </a>
      </p>
    </div>

    <div style="margin-bottom:16px;">
      <strong>Phone:</strong>
      <p style="background:#fafafa;padding:10px;border-radius:6px;">${phone}</p>
    </div>

    <div style="margin-bottom:16px;">
      <strong>Qualification:</strong>
      <p style="background:#fafafa;padding:10px;border-radius:6px;">${qualification}</p>
    </div>

    <div style="margin-bottom:16px;">
      <strong>Course:</strong>
      <p style="background:#fafafa;padding:10px;border-radius:6px;">${interest}</p>
    </div>

    <div style="margin-bottom:16px;">
      <strong>Leads From:</strong>
      <p style="background:#fafafa;padding:10px;border-radius:6px;">${hear}</p>
    </div>

    <div style="margin-bottom:16px;">
      <strong>Message:</strong>
      <p style="background:#fafafa;padding:10px;border-radius:6px;white-space:pre-wrap;">
        ${message}
      </p>
    </div>

    <div style="text-align:center;margin-top:25px;">
      <p style="color:#B67032;font-weight:bold;margin:0;">Digital Paaji</p>
      <p style="color:#999;font-size:12px;margin-top:4px;">
        Digital Paaji Academy • Patiala
      </p>
    </div>

  </div>
</div>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    // =============================
    // WHATSAPP API (AXIOS)
    // =============================
    const whatsappUrl = "https://console.authkey.io/restapi/requestjson.php";

    const whatsappPayload = {
      country_code: "91",
      mobile: phone,
      wid: "7130",
      type: "interactive",
      template_name: "academy",
      language: {
        policy: "deterministic",
        code: "en",
      },
      bodyValues: {
        1: name,
        2: interest,
      },
    };

    try {
      const whatsappResponse = await axios.post(
        whatsappUrl,
        whatsappPayload,
        {
          headers: {
            Authorization: "Basic 20b1a74e419f290e",
            "Content-Type": "application/json",
          },
        }
      );

    } catch (err) {
      console.log(
        "WhatsApp sending failed:",
        err.response?.data || err.message
      );
    }

    // Success Response
    res.status(200).json({
      message: "Your message has been sent successfully!",
    });

  } catch (error) {
    console.error("Email or WhatsApp error:", error.message);
    res.status(500).json({
      error: "Failed to send message. Please try again later.",
    });
  }
});







const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
