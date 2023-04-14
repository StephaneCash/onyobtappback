const router = require('express').Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const multer = require('../middleware/multer');

// Authentication
router.post('/register', authController.signUp);
router.post('/login', authController.signIn);

//Get allUsers
router.get('/', userController.getAllUsers);
//Get One user
router.get('/:id', userController.getOneUser);
//Update User
router.put('/:id', multer, userController.updateUser);
//Delete User
router.delete('/:id', userController.deleteUser);
router.patch('/follow/:id', userController.followUser);
router.patch('/unFollowUser/:id', userController.unFollowUser);

module.exports = router;