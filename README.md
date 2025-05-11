![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
# Threads-Api

Серверная часть приложения Threads-клона. Реализует REST API с использованием Express.js, Prisma и MongoDB. База данных разворачивается в Docker-контейнере.

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
