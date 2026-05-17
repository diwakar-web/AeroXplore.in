const BlogStat = require('../Modals/BlogStat');

const getBlogStats = async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!blogId) {
      return res.status(400).json({ success: false, message: 'Blog ID is required' });
    }

    const stat = await BlogStat.findOne({ blogId });
    if (!stat) {
      return res.status(200).json({ success: true, likes: 0, dislikes: 0 });
    }

    return res.status(200).json({ success: true, likes: stat.likes, dislikes: stat.dislikes });
  } catch (error) {
    console.error('Error in getBlogStats:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching blog stats' });
  }
};

const voteBlog = async (req, res) => {
  try {
    const { blogId, action } = req.body;
    if (!blogId || !['like', 'dislike'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid blog ID or vote action' });
    }

    const updateField = action === 'like' ? { likes: 1 } : { dislikes: 1 };
    const updatedStat = await BlogStat.findOneAndUpdate(
      { blogId },
      { $inc: updateField },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      likes: updatedStat.likes,
      dislikes: updatedStat.dislikes,
    });
  } catch (error) {
    console.error('Error in voteBlog:', error);
    return res.status(500).json({ success: false, message: 'Server error while voting on blog' });
  }
};

module.exports = {
  getBlogStats,
  voteBlog,
};
