const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createComment,
  deleteComment,
  updateComment,
  getCommentsByPostId
} = require('../controllers/commentController');

router.post('/', auth, createComment);
router.get('/:postId', getCommentsByPostId);
router.put('/:id', auth, updateComment);     
router.delete('/:id', auth, deleteComment);  

module.exports = router;
