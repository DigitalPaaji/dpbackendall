const Admin = require("../models/adminModel");
const {genSaltSync,hashSync ,compareSync}= require("bcrypt")
const jwt = require("jsonwebtoken")
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

module.exports= {createAdmin,loginAdmin,logoutAdmin,getAdmin}