const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  heading: String,
  paragraphs: [String],
  points: [String]
});

const FaqSchema = new mongoose.Schema({
  question: String,
  answer: String
});

const BlogSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  service: String,
  city: String,
  title: String,
  images: [String],
  date: String,
  tag: String,
  description: String,
  meta: {
    title: String,
    description: String
  },
  sections: [SectionSchema],
  faqs: [FaqSchema],
  type:{
    type:String,
    enum:["academy","company"],
    default:"academy"
  }
});

module.exports = mongoose.model("Blog", BlogSchema);
