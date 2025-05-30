const { prisma } = require('../prisma/prisma-client');

const LikeController = {
	addLike: async (req, res) => {
		const { postId } = req.body;
		const userId = req.user.userId;

		if (!postId) {
			return res.status(400).json({ error: 'Заполните все поля' });
		}

		try {
			const existingLike = await prisma.like.findFirst({
				where: { postId, userId },
			});

			if (existingLike) {
				return res.status(400).json({ error: 'Вы уже поставили лайк' });
			}

			const like = await prisma.like.create({
				data: {
					postId,
					userId,
				},
			});

			res.json(like);
		} catch (error) {
			console.error('Add Like Error', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
	removeLike: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;

		if (!id) {
			return res.status(400).json({ error: 'Не передан ID поста' });
		}

		try {
			const existingLike = await prisma.like.findFirst({
				where: { postId: id, userId },
			});

			if (!existingLike) {
				return res.status(400).json({ error: 'Дизлайк уже существует' });
			}

			const like = await prisma.like.deleteMany({
				where: { postId: id, userId },
			});

			res.json(like);
		} catch (error) {
			console.error('Delete Like Error', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
};

module.exports = LikeController;
