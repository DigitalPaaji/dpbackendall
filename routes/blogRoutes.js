const express = require("express");
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsCompany,
  getBlogsacademy,
  getSingleBlog,
  getService,
  getCity,
} = require("../controllers/blogController");

router.get("/", getBlogs);
router.get("/company",getBlogsCompany)
router.get("/academy",getBlogsacademy)
router.get("/single/:slug", getBlogBySlug);

router.get('/get/:service/:city',getSingleBlog)
router.get("/service",getService)
router.get("/city/:service",getCity)





// Admin routes
router.post("/", createBlog);
router.put("/:slug", updateBlog);
router.delete("/:slug", deleteBlog);


module.exports = router;
