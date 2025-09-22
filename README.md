# Amgalan (локальная разработка с Docker)

Проект состоит из бэкенда (Express + Sequelize + Postgres) и фронтенда на Next.js.

## Быстрый старт

1. Скопируйте `.env.example` в `.env` (значения можно оставить по умолчанию)
2. Запустите сборку и запуск контейнеров:

```powershell
docker-compose up --build
```

## Сервисы и порты

- **Фронтенд**: http://localhost:3000
- **Бэкенд API**: http://localhost:5000  
- **База данных**: Postgres на порту 5432

## Особенности

- Данные БД сохраняются в Docker volume `db_data`
- Загруженные файлы хранятся в `backend/uploads`
- Таблицы БД создаются автоматически при запуске

## Переменные окружения

Основные настройки в файле `.env`:
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `PORT` (порт бэкенда, по умолчанию 5000)