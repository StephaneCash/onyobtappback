const router = require('express').Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/multer');

router.get('/', postController.readPost);
router.post('/', upload, postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.patch('/like/:id', postController.likePost);
router.patch('/unlike-post/:id', postController.unlikePost);
router.get("/v1/users/:id", postController.getAllPostsByUserId);

//commentaires
router.patch('/comment/:id', postController.commentPost);
router.patch('/edit-comment-post/:id', postController.editCommentPost);
router.patch('/delete-comment-post/:id', postController.deleteCommentPost);

//Views
router.patch('/views/:id', postController.viewAdd);

module.exports = router;