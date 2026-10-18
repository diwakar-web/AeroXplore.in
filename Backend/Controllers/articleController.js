const Article = require('../Modals/Article');
const User = require('../Modals/User');
const { uploadStream } = require('../Utils/cloudinary');

// Helper to parse content into array of non-empty paragraphs
const parseContent = (content) => {
  if (Array.isArray(content)) {
    return content.map((p) => (typeof p === 'string' ? p.trim() : '')).filter((p) => p.length > 0);
  }
  if (typeof content === 'string') {
    return content
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }
  return [];
};

// 1. Create a new article
exports.createArticle = async (req, res) => {
  try {
    const { title, authorName, category, thought, theme, image, content, status } = req.body;

    // Non-admin authors must have acknowledged and accepted creator guidelines
    const isSuper = req.user.isSuperUser;
    if (!isSuper && !req.user.creatorGuidelinesAccepted) {
      return res.status(403).json({
        success: false,
        message: 'You must review and accept the AeroXplore Editorial & Author Guidelines before publishing an article.',
        requiresGuidelinesAcceptance: true,
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Article title is required.' });
    }

    const parsedContent = parseContent(content);
    if (parsedContent.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one paragraph of content.' });
    }

    const finalAuthorName = (authorName && authorName.trim()) || req.user.name || req.user.email.split('@')[0] || 'AeroXplore Aviator';
    const validThemes = ['article-bg', 'article-bg-blue', 'article-bg-green', 'article-bg-pink'];
    const finalTheme = validThemes.includes(theme) ? theme : 'article-bg';

    const newArticle = await Article.create({
      author: req.user._id,
      authorName: finalAuthorName,
      title: title.trim(),
      category: category || 'Defence Aviation',
      thought: thought ? thought.trim() : '',
      theme: finalTheme,
      image: image && image.trim() ? image.trim() : '/images/Background.png',
      content: parsedContent,
      status: status === 'draft' ? 'draft' : 'published',
    });

    return res.status(201).json({
      success: true,
      message: 'Article published successfully!',
      article: newArticle,
    });
  } catch (err) {
    console.error('Create Article Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to publish article.' });
  }
};

// 2. Update an existing article (Author or Developer superpower)
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, authorName, category, thought, theme, image, content, status } = req.body;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    // Strict ownership: user cannot edit another author's article
    const authorId = article.author?._id
      ? article.author._id.toString()
      : (article.author ? article.author.toString() : '');
    const reqUserId = req.user?._id
      ? req.user._id.toString()
      : (req.user?.id ? req.user.id.toString() : '');
    const isOwner = Boolean(
      (authorId && reqUserId && authorId === reqUserId) ||
      (article.author && article.author.equals && article.author.equals(req.user._id))
    );
    const isAdmin = Boolean(req.user && (req.user.isSuperUser || req.user.role === 'admin'));

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit another author\'s article.' });
    }

    if (title && title.trim()) article.title = title.trim();
    if (authorName && authorName.trim()) article.authorName = authorName.trim();
    if (category) article.category = category.trim();
    if (thought !== undefined) article.thought = thought.trim();
    if (image && image.trim()) article.image = image.trim();

    const validThemes = ['article-bg', 'article-bg-blue', 'article-bg-green', 'article-bg-pink'];
    if (theme && validThemes.includes(theme)) article.theme = theme;

    if (content) {
      const parsed = parseContent(content);
      if (parsed.length > 0) article.content = parsed;
    }

    if (status && ['published', 'draft'].includes(status)) {
      article.status = status;
    }

    await article.save();

    return res.status(200).json({
      success: true,
      message: article.status === 'draft' ? 'Draft saved successfully!' : 'Article updated successfully!',
      article,
    });
  } catch (err) {
    console.error('Update Article Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update article.' });
  }
};

// 3. Delete an article (Strictly author only or Admin)
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    const authorId = article.author?._id
      ? article.author._id.toString()
      : (article.author ? article.author.toString() : '');
    const reqUserId = req.user?._id
      ? req.user._id.toString()
      : (req.user?.id ? req.user.id.toString() : '');
    const isOwner = Boolean(
      (authorId && reqUserId && authorId === reqUserId) ||
      (article.author && article.author.equals && article.author.equals(req.user._id))
    );
    const isAdmin = Boolean(req.user && (req.user.isSuperUser || req.user.role === 'admin'));

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete another author\'s article.' });
    }

    await article.deleteOne();
    return res.status(200).json({ success: true, message: 'Article deleted successfully.' });
  } catch (err) {
    console.error('Delete Article Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete article.' });
  }
};

// 4. Get articles for My Articles page (supports ?all=true for developer superpower)
exports.getMyArticles = async (req, res) => {
  try {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
    });

    const isAllRequested = req.query.all === 'true';

    // If developer superpower requests all articles
    if (isAllRequested && req.user.isSuperUser) {
      const articles = await Article.find().sort({ createdAt: -1 }).populate('author', 'name email photoURL');
      return res.status(200).json({
        success: true,
        count: articles.length,
        isSuperUser: true,
        articles,
      });
    }

    let authorFilter = { author: req.user._id };
    if (req.user.isSuperUser) {
      const adminUsers = await User.find({
        $or: [
          { email: 'diwakarnagar01@gmail.com' },
          { email: 'diwakarrajeshnagar@gmail.com' },
          { role: 'admin' },
          { _id: req.user._id },
        ],
      }).select('_id');
      const adminIds = adminUsers.map((u) => u._id);
      authorFilter = { author: { $in: adminIds } };
    }

    const articles = await Article.find(authorFilter).sort({ createdAt: -1 }).populate('author', 'name email photoURL');
    return res.status(200).json({
      success: true,
      count: articles.length,
      isSuperUser: !!req.user.isSuperUser,
      articles,
    });
  } catch (err) {
    console.error('Get My Articles Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve articles.' });
  }
};

// 5. Get all published articles (Public for AllBlogs archive and Home feed)
exports.getAllArticles = async (req, res) => {
  try {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
    });

    const articles = await Article.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .populate('author', 'name email photoURL');

    return res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (err) {
    console.error('Get All Articles Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load dispatches.' });
  }
};

// 6. Get single article by ID or slug
exports.getArticleById = async (req, res) => {
  try {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
    });

    const { id } = req.params;
    let article = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      article = await Article.findById(id).populate('author', 'name email photoURL');
    }
    if (!article) {
      const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      article = await Article.findOne({
        slug: { $regex: new RegExp(`^${escapeRegex(id)}$`, 'i') },
      }).populate('author', 'name email photoURL');
    }

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    // If article is unpublished draft, only author or admin can view
    if (article.status === 'draft') {
      const rawAuthorId = article.populated ? article.populated('author') : null;
      const authorId = article.author?._id
        ? article.author._id.toString()
        : (article.author ? article.author.toString() : (rawAuthorId ? rawAuthorId.toString() : ''));
      const authorEmail = article.author?.email
        ? article.author.email.toLowerCase().trim()
        : '';
      const reqUserId = req.user?._id
        ? req.user._id.toString()
        : (req.user?.id ? req.user.id.toString() : '');
      const reqUserEmail = req.user?.email
        ? req.user.email.toLowerCase().trim()
        : '';

      const isAuthor = Boolean(
        req.user &&
        (
          (authorId && reqUserId && authorId === reqUserId) ||
          (authorEmail && reqUserEmail && authorEmail === reqUserEmail)
        )
      );
      const isAdmin = Boolean(req.user && (req.user.isSuperUser || req.user.role === 'admin'));

      if (!isAuthor && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'This dispatch is in draft status and can only be viewed by its author or an administrator.',
        });
      }
    }

    return res.status(200).json({ success: true, article });
  } catch (err) {
    console.error('Get Article Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load article.' });
  }
};

// 7. Upload Image to Cloudinary
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const result = await uploadStream(req.file.buffer, 'aeroxplore/articles');
    return res.status(200).json({
      success: true,
      url: result.url,
      public_id: result.public_id,
      message: 'Image uploaded successfully!',
    });
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    return res.status(500).json({ success: false, message: 'Image upload failed. Please try again.' });
  }
};
