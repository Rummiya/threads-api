const { prisma } = require('../prisma/prisma-client');

const FollowController = {
	followUser: async (req, res) => {
		const { followingId } = req.body;
		const userId = req.user.userId;

		if (followingId === userId) {
			return res.status(500).json({ error: 'Нельзя подписаться на себя' });
		}

		try {
			const existingFollow = await prisma.follow.findFirst({
				where: { AND: [{ followerId: userId }, { followingId }] },
			});

			if (existingFollow) {
				res.status(400).json({ error: 'Вы уже подписаны' });
			}

			await prisma.follow.create({
				data: {
					follower: { connect: { id: userId } },
					following: { connect: { id: followingId } },
				},
			});

			res.status(201).json({ message: 'Подписка успешно создана' });
		} catch (error) {
			console.error('Follow Error', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},
	unfollowUser: async (req, res) => {
		const { followingId } = req.body;
		const userId = req.user.userId;

		try {
			const follows = await prisma.follow.findFirst({
				where: { AND: [{ followerId: userId }, { followingId }] },
			});

			if (!follows) {
				return res.status(404).json({ error: 'Подписка не найдена' });
			}

			await prisma.follow.delete({
				where: { id: follows.id },
			});

			res.status(201).json({ message: 'Подписка успешно удалена' });
		} catch (error) {
			console.error('Unfollow Error', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},
};

module.exports = FollowController;
