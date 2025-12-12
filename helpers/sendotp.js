const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
dotenv.config()
 const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });



const sendOtptranspoter = async (email, otp) => {
  try {
    const options = {
      from: `Digital Paaji <${process.env.EMAIL}>`,
      to: email,
      subject: "OTP Verification",
      html: `
        <div style="max-width:480px; margin:auto; padding:20px; font-family:Arial, sans-serif; border:1px solid #ddd; border-radius:8px; background:#f9f9f9;">
          <h2 style="text-align:center; color:#007bff;">Your OTP Code</h2>

          <p style="font-size:16px;">Hello,</p>
          <p style="font-size:16px;">Use the OTP below to verify your email address:</p>

          <div style="text-align:center; margin:20px 0;">
            <div style="display:inline-block; padding:15px 25px; font-size:28px; font-weight:bold; color:#fff; background:#007bff; border-radius:8px;">
              ${otp}
            </div>
          </div>

          <p style="font-size:14px; color:#555;">
            This OTP is valid for <strong>5 minutes</strong>. Do not share this code with anyone.
          </p>

          <p style="margin-top:30px; text-align:center; font-size:16px;">
            <strong>Digital Paaji</strong>
          </p>
        </div>
      `,
    };

    await transporter.sendMail(options);
  } catch (error) {
    console.error("Email send error:", error);
  }
};

module.exports = sendOtptranspoter;
