const Admin = require("../models/adminModel");
const {genSaltSync,hashSync ,compareSync}= require("bcrypt")
const jwt = require("jsonwebtoken");
const sendOtptranspoter = require("../helpers/sendotp");
const Otp = require("../models/otpModel");
const SECRET_KEY=`${process.env.SECRET_KEY}`;


const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: admin._id },
      SECRET_KEY,
      { expiresIn: "20d" }
    );

    res.cookie("adminToken", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.WORK=="production"? true:false,
      sameSite: process.env.WORK=="production"? "none": "lax",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
    });

    return res.status(201).json({
      success: true,
      message: "Admin signup successful",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message:error.message,
    });
  }
};


const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = compareSync(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      { id: admin._id },
      SECRET_KEY,
      { expiresIn: "20d" }
    );

    res.cookie("adminToken", token, {
       path: "/",
      httpOnly: true,
      secure: process.env.WORK=="production"? true:false,
      sameSite: process.env.WORK=="production"? "none": "lax",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const logoutAdmin = async(req,res)=>{
    try {
        res.clearCookie("adminToken", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
      return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
    } catch (error) {
          return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    }
} 

const getAdmin = async(req,res)=>{

        const admin = req.admin;
        return res.status(200).json({success:true,admin})
    
}

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if(!email){
      return res.json({success:false,message:"enter email"})
    }
    const checkEmail = await Admin.findOne({ email });
    if (!checkEmail) {
      return res.status(404).json({success:false, msg: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await Otp.deleteMany({ email });

    await sendOtptranspoter(email, otp);

    await Otp.create({ email, otp });

    return res.json({success:true, msg: "OTP sent successfully" });

  } catch (error) { 
    console.error(error);
    return res.status(500).json({success:false, msg: "Internal Server Error" });
  }
};

const verifyotp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }


    if (String(otpRecord.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() - otpRecord.createdAt > 10 * 60 * 1000) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Hash new password
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(newPassword, salt);

    // Update admin password
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    admin.password = hashedPassword;
    await admin.save();

    // Delete OTP after successful use
    await Otp.deleteMany({ email });

    return res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};





module.exports= {createAdmin,loginAdmin,logoutAdmin,getAdmin,sendOtp,verifyotp}