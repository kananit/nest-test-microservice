# # Этап 1: Установка зависимостей
# FROM node:20.11.1-bullseye-slim AS builder

# WORKDIR /app

# COPY package.json yarn.lock ./

# RUN yarn install --frozen-lockfile

# # Этап 2: Сборка приложения
# FROM builder AS build

# COPY . .

# RUN yarn build

# # Этап 3: Финальный образ
# FROM node:20.11.1-bullseye-slim

# WORKDIR /app

# COPY --from=build /app/dist /app/dist
# COPY --from=build /app/node_modules /app/node_modules

# USER node

# CMD ["yarn", "start"]


# ================================
# Этап 1: Установка зависимостей
# ================================
FROM node:20.11.1-bullseye-slim AS builder
WORKDIR /app

# Копируем только package.json и yarn.lock
COPY package.json yarn.lock ./
# Устанавливаем зависимости (используется cache‑слой)
RUN yarn install --frozen-lockfile

# ================================
# Этап 2: Сборка приложения
# ================================
FROM builder AS build
WORKDIR /app

# Копируем весь исходник
COPY . .
RUN yarn build

# ===================================
# Этап 3: Финальный образ для продакшна
# ===================================
FROM node:20.11.1-bullseye-slim
WORKDIR /app

# Копируем из предыдущей стадии только нужные артефакты
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Работаем от небезопасного root'а небезопасно — лучше использовать node
USER node

# Открываем порт (если нужно)
EXPOSE 3000

# Запуск приложения
CMD ["node", "dist/main.js"]
