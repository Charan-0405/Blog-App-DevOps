const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  getPostById
} = require('../controllers/postController');

router.post('/', auth, createPost);
router.get('/', getAllPosts);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.get('/:id', getPostById);

module.exports = router;
