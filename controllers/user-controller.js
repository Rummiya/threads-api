const bcrypt = require('bcryptjs');
const { prisma } = require('../prisma/prisma-client');
const jdenticon = require('jdenticon');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const UserController = {
	register: async (req, res) => {
		const { email, password, name } = req.body;

		if (!email || !password || !name) {
			return res.status(400).json({ error: 'Заполните все поля' });
		}

		try {
			const existingUser = await prisma.user.findUnique({ where: { email } });

			if (existingUser) {
				return res.status(400).json({ error: 'Пользователь уже существует' });
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			// const png = jdenticon.toPng(`${name}${Date.now()}`, 200);
			// const avatarName = `${name}_${Date.now()}.png`;
			// const avatarPath = path.join(__dirname, '/../uploads', avatarName);

			// fs.writeFileSync(avatarPath, png);

			const user = await prisma.user.create({
				data: {
					email,
					password: hashedPassword,
					name,
					avatarUrl: `/images/def-user.png`,
				},
			});

			res.json(user);
		} catch (error) {
			console.error('Error in register', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
	login: async (req, res) => {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: 'Заполните все поля' });
		}

		try {
			const user = await prisma.user.findUnique({ where: { email } });

			if (!user) {
				return res.status(400).json({ error: 'Неверный логин или пароль' });
			}

			const valid = await bcrypt.compare(password, user.password);

			if (!valid) {
				return res.status(400).json({ error: 'Неверный логин или пароль' });
			}

			const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
			res.json({ token });
		} catch (error) {
			console.error('Login error', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
	getUserById: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;

		try {
			const user = await prisma.user.findUnique({
				where: { id },
				include: {
					following: {
						include: {
							following: true,
						},
					},
					followers: {
						include: {
							follower: true,
						},
					},
					posts: {
						include: {
							author: true,
							comments: true,
							likes: true,
						},
					},
					likes: {
						include: {
							post: {
								include: {
									author: true,
									comments: true,
									likes: true,
								},
							},
						},
					},
				},
			});

			if (!user) {
				return res.status(404).json({ error: 'Пользователь не найден' });
			}

			const postWithLikeInfo = user.posts.map(post => ({
				...post,
				likedByUser: post.likes.some(like => like.userId === userId),
			}));

			const likedPosts = user.likes.map(like => like.post);
			const likedPostWithLikes = likedPosts.map(post => ({
				...post,
				likedByUser: post.likes.some(like => like.userId === userId),
			}));

			const isFollowing = await prisma.follow.findFirst({
				where: {
					AND: [{ followerId: userId }, { followingId: id }],
				},
			});

			res.json({
				...user,
				isFollowing: Boolean(isFollowing),
				posts: postWithLikeInfo,
				likedPosts: likedPostWithLikes,
			});
		} catch (error) {
			console.error('Get Current Error', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
	getUsersByNickname: async (req, res) => {
		try {
			const { query } = req.query;

			if (!query) {
				return res.status(400).json({ message: 'Введите поисковой запрос' });
			}
			const users = await prisma.user.findMany({
				where: {
					name: {
						contains: query,
						mode: 'insensitive',
					},
				},
			});

			res.json(users);
		} catch (error) {
			res.status(500).json({ message: 'Internal server error', error });
		}
	},
	updateUser: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;
		const { email, name, dateOfBirth, bio, location } = req.body;

		let filePath;

		if (req.file && req.file.path) {
			filePath = req.file.path;
		}

		if (id !== userId) {
			return res.status(403).json({ error: 'Нет доступа' });
		}

		try {
			if (email) {
				const existingUser = await prisma.user.findFirst({
					where: { email: email },
				});

				if (existingUser && existingUser.id !== id) {
					return res.status(400).json({ error: 'Почта уже занята' });
				}
			}

			const user = await prisma.user.update({
				where: { id },
				data: {
					email: email || undefined,
					name: name || undefined,
					avatarUrl: filePath ? `/${filePath}` : undefined,
					dateOfBirth: dateOfBirth || undefined,
					bio: bio || undefined,
					location: location || undefined,
				},
			});

			res.json(user);
		} catch (error) {
			console.error('Update User Error', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
	current: async (req, res) => {
		const userId = req.user.userId;

		try {
			const user = await prisma.user.findUnique({
				where: { id: userId },
				include: {
					followers: {
						include: {
							follower: true,
						},
					},
					following: {
						include: {
							following: true,
						},
					},
				},
			});

			if (!user) {
				return res.status(400).json({ error: 'Пользователь не найден' });
			}

			res.json(user);
		} catch (error) {
			console.error('Get Current Error', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
};

module.exports = UserController;
