const { prisma } = require('../prisma/prisma-client');

const PostController = {
	createPost: async (req, res) => {
		const { content } = req.body;
		const authorId = req.user.userId;

		if (!content) {
			return res.status(400).json({ error: 'Заполните все поля' });
		}

		try {
			const post = await prisma.post.create({
				data: {
					content,
					authorId,
				},
			});
			res.json(post);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
	updatePost: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;
		const { content } = req.body;

		if (!content) {
			return res.status(401).json({ error: 'Заполните поле' });
		}

		try {
			const post = await prisma.post.findUnique({
				where: { id },
			});

			if (userId !== post.authorId) {
				return res.status(403).json({ error: 'Вы не автор поста' });
			}

			const updatedPost = await prisma.post.update({
				where: { id },
				data: {
					content,
				},
			});

			res.json(updatedPost);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
	getAllPost: async (req, res) => {
		const userId = req.user.userId;

		try {
			const posts = await prisma.post.findMany({
				include: {
					author: true,
					likes: true,
					comments: true,
				},
				orderBy: {
					createdAt: 'desc',
				},
			});

			const postWithLikeInfo = posts.map(post => ({
				...post,
				likedByUser: post.likes.some(like => like.userId === userId),
			}));

			res.json(postWithLikeInfo);
		} catch (error) {
			console.error('get all post error', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
	getPostById: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;

		try {
			const post = await prisma.post.findUnique({
				where: { id },
				include: {
					comments: {
						include: {
							user: true,
						},
					},
					likes: true,
					author: true,
				},
			});

			if (!post) {
				return res.status(404).json({ error: 'Пост не найден' });
			}

			const postWithLikeInfo = {
				...post,
				likedByUser: post.likes.some(like => like.userId === userId),
			};

			res.json(postWithLikeInfo);
		} catch (error) {
			console.error('get post by id error', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
	deletePost: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;

		const post = await prisma.post.findUnique({
			where: { id },
		});

		if (!post) {
			return res.status(404).json({ error: 'Пост не найден' });
		}

		if (post.authorId !== userId) {
			return res.status(403).json({ error: 'Вы не автор поста' });
		}
		try {
			const transaction = await prisma.$transaction([
				prisma.comment.deleteMany({ where: { postId: id } }),
				prisma.like.deleteMany({ where: { postId: id } }),
				prisma.post.delete({ where: { id } }),
			]);

			res.json(transaction);
		} catch (error) {
			console.error('delete post error', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
};

module.exports = PostController;
