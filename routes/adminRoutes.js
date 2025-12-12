const express = require("express");
const { createAdmin, loginAdmin, logoutAdmin, getAdmin, sendOtp, verifyotp } = require("../controllers/adminController");
const { verifyAdmin } = require("../middlewere/adminMiddlewere");
const router = express.Router();
 

router.post("/signup",createAdmin)
router.post("/login",loginAdmin)
router.get("/logout",verifyAdmin,logoutAdmin)
router.get("/",verifyAdmin,getAdmin)
router.post("/sendotp",sendOtp)
router.post("/verifyotp",verifyotp)

module.exports = router;