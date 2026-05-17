const mongoose = require('mongoose');

const blogStatSchema = new mongoose.Schema(
  {
    blogId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlogStat', blogStatSchema);
