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

## Для запуска проекта, необходимо выполнить следующие шаги:
Склонировать репозиторий с api.
```
git clone https://github.com/Rummiya/threads-api.git
```
Склонировать репозиторий с клиентским приложением.
```
git clone https://github.com/Rummiya/threads.git
```
Открыть терминал (или командную строку) и перейти в корневую директорию сервера.
```
cd threads-api
```
Переименовать файл .env.local (убрать .local)

```
.env
```
Запустить команду docker compose которая поднимет сервер, клиент и базу данных

```
docker compose up
```
Открыть браузер и перейти по адресу http://localhost:80, чтобы увидеть запущенный проект.
Если вы хотите скачать образ базы данных MongoDB
Запустите контейнер с образом MongoDB и настройками replica set (он автоматичиски скачает и запустит этот образ):
```
  docker run --name mongo \
       -p 27017:27017 \
       -e MONGO_INITDB_ROOT_USERNAME="monty" \
       -e MONGO_INITDB_ROOT_PASSWORD="pass" \
       -d prismagraphql/mongo-single-replica:5.0.3
```
