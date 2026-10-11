const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      default: 'AeroXplore Aviator',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'Defence Aviation',
      trim: true,
    },
    thought: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '/images/Background.png',
    },
    content: {
      type: [String],
      default: [],
    },
    theme: {
      type: String,
      default: 'article-bg',
      enum: ['article-bg', 'article-bg-blue', 'article-bg-green', 'article-bg-pink'],
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
  },
  { timestamps: true }
);

// Auto-generate slug before saving if not provided
articleSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4);
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);
