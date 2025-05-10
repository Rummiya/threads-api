# Threads Api

Серверная часть приложения Threads-клона. Реализует REST API с использованием Express.js, Prisma и MongoDB. База данных разворачивается в Docker-контейнере.

## 🛠️ Стек

- **Express.js** — HTTP-сервер и роутинг
- **Prisma ORM** — типобезопасный доступ к MongoDB
- **MongoDB** — основная база данных (запускается через Docker)
- **Docker** — управление окружением для MongoDB и сборка backend-контейнера (если необходимо)

## ⚙️ Требования

- Node.js (>= 18)
- Docker и Docker Compose

## 🚀 Установка и запуск

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/your-username/threads-backend.git
cd threads-api

npm install

docker-compose up -d
```
