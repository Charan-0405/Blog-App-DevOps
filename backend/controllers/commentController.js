const Comment = require('../models/Comment');
const Post = require('../models/Post');
// Create a new comment
exports.createComment = async (req, res) => {
  
  try {
    const { postId, content } = req.body;
console.log('Incoming request:', { postId, content, user: req.user });

    const comment = await Comment.create({
      postId: postId, // must match the field name in your schema
      author: req.user._id,
      content,
    });

    res.status(201).json(comment);
  } catch (error) {
     console.error('❌ Error creating comment:', error);
    res.status(500).json({ error: 'Error creating comment' });
  }
};

// Get all comments for a specific post
exports.getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ postId })
      .populate('author', 'username') // include comment author username
      .populate({
        path: 'postId',
        select: 'author', // we only need post author id
      });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ msg: 'Comment not found' });


    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to update this comment' });
    }

    comment.content = req.body.content || comment.content;
    await comment.save();

    res.status(200).json({ msg: 'Comment updated successfully', comment });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    const post = await Post.findById(comment.postId);
    if (!post) return res.status(404).json({ msg: 'Associated post not found' });

    const isCommentAuthor = comment.author.toString() === req.user.id;
    const isPostOwner = post.author.toString() === req.user.id;

    if (!isCommentAuthor && !isPostOwner) {
      return res.status(403).json({ msg: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.status(200).json({ msg: 'Comment deleted successfully' });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
