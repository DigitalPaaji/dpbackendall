const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const SECRET_KEY=`${process.env.SECRET_KEY}`;


const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;


    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    req.admin = admin;
    next();

  } catch (error) {
    console.error("Verify Admin Error:", error);
    return res.status(500).json({
      success: false,
      message:"Server Error",
    });
  }

};


module.exports ={verifyAdmin}