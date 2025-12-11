const Blog = require("../models/blogs");

// Get all blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ success: false, message: "Slug is required" });
    }

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    return res.status(200).json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error("Error fetching blog:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};


// Create blog
const createBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getBlogsCompany = async (req, res) => {
  try {
    const blogs = await Blog.find({type:"company"});

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getBlogsacademy = async (req, res) => {
  try {
    const blogs = await Blog.find({type:"academy"});
   
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingleBlog = async (req, res) => {
  try {
    const { service, city } = req.params;

    if (!service || !city) {
      return res.status(400).json({
        success: false,
        message: "Service and City are required",
      });
    }

    const blog = await Blog.findOne({ service, city });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:error.message,
    });
  }
};

const getService = async (req, res) => {
  try {
    const services = await Blog.distinct("service");

    return res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: services,
    });

  } catch (error) {
    console.error("Error fetching services:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const getCity = async (req, res) => {
  try {
    const { service } = req.params;
    if (!service) {
      return res.status(400).json({
        success: false,
        message: "Service parameter is required",
      });
    }
    const cities = await Blog.distinct("city", { service });
    return res.status(200).json({
      success: true,
      message: "Cities fetched successfully",
      data: cities,
    });

  } catch (error) {
    console.error("Error fetching cities:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsCompany,
  getBlogsacademy,
  getSingleBlog,
  getService,
  getCity

};
