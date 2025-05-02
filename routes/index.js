const express = require('express');
const multer = require('multer');
const {
	UserController,
	PostController,
	CommentController,
	LikeController,
	FollowController,
} = require('../controllers');
const authenticateToken = require('../midddleware/auth');

const router = express.Router();

const uploadDestination = 'uploads';

// показываем, где хранить файлы
const storage = multer.diskStorage({
	destination: uploadDestination,
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage });

// Роуты юзера
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', authenticateToken, UserController.current);
router.get('/user/:id', authenticateToken, UserController.getUserById);
router.get('/users', authenticateToken, UserController.getUsersByNickname);
router.put(
	'/user/:id',
	authenticateToken,
	upload.single('avatar'),
	UserController.updateUser
);

// Роуты поста
router.post('/posts', authenticateToken, PostController.createPost);
router.put('/posts/:id', authenticateToken, PostController.updatePost);
router.get('/posts', authenticateToken, PostController.getAllPost);
router.get('/posts/:id', authenticateToken, PostController.getPostById);
router.delete('/posts/:id', authenticateToken, PostController.deletePost);

// Роуты комментария
router.post('/comment', authenticateToken, CommentController.createComment);
router.delete(
	'/comment/:id',
	authenticateToken,
	CommentController.deleteComment
);

// Роуты лайка
router.post('/like', authenticateToken, LikeController.addLike);
router.delete('/like/:id', authenticateToken, LikeController.removeLike);

// Роуты подписок
router.post('/follow', authenticateToken, FollowController.followUser);
router.delete(
	'/unfollow/:id',
	authenticateToken,
	FollowController.unfollowUser
);

module.exports = router;
