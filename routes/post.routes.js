const router = require('express').Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/multer');

router.get('/', postController.readPost);
router.post('/', upload, postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.patch('/like-post/:id', postController.likePost);
router.patch('/unlike-post/:id', postController.unlikePost);
router.get("/v1/users/:id", postController.getAllPostsByUserId);

//commentaires
router.patch('/comment-post/:id', postController.commentPost);
router.patch('/edit-comment-post/:id', postController.editCommentPost);
router.patch('/delete-comment-post/:id', postController.deleteCommentPost);

module.exports = router;