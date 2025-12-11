const express = require("express");
const { createAdmin, loginAdmin, logoutAdmin, getAdmin } = require("../controllers/adminController");
const { verifyAdmin } = require("../middlewere/adminMiddlewere");
const router = express.Router();


router.post("/signup",createAdmin)
router.post("/login",loginAdmin)
router.get("/logout",verifyAdmin,logoutAdmin)
router.get("/",verifyAdmin,getAdmin)

module.exports = router;