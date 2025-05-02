# Используем образ Линукс Alpine
FROM node:19.5.0-alpine

# Указываем нашу рабочую директорию
WORKDIR /app

# Скопируем package.json и package-lock.json в наш контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем оставшееся приложение
COPY . .

# Установить Prisma
RUN npm install -g prisma

# Генерируем Prisma-Client
RUN prisma generate

# Копируем Prisma-Schema
COPY prisma/schema.prisma ./prisma/

# Открываем порт в нашем контейнере
EXPOSE 3000

# Запускаем наш сервер
CMD [ "npm", "start" ]