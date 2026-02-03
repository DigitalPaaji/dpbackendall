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
  // getSingleBlog,
  getService,
  getCity,
  getSingleBlogBySlug,
} = require("../controllers/blogController");
const  storage  = require("../helpers/saveImage");

router.get("/", getBlogs);
router.get("/company",getBlogsCompany)
router.get("/academy",getBlogsacademy)
router.get("/single/:slug", getBlogBySlug);

router.get('/get/:slug',getSingleBlogBySlug)
router.get("/service",getService)
router.get("/city/:service",getCity)

// Admin routes
router.post("/",storage.array("images",10), createBlog);
router.put("/:slug",storage.array("newImages",10), updateBlog);
router.delete("/:slug", deleteBlog);


module.exports = router;
