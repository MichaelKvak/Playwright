# Використовуємо офіційний образ Playwright з підтримкою браузерів
FROM mcr.microsoft.com/playwright:v1.50.1-jammy

# Оновлюємо список пакетів та встановлюємо Xvfb для запуску тестів без голови
RUN apt-get update && apt-get install -y xvfb

# Встановлюємо робочу директорію всередині контейнера
WORKDIR /app

# Копіюємо файли проєкту в контейнер
COPY . .

# Встановлюємо залежності проєкту
RUN npm install

# Запускаємо Playwright тести в безголовному режимі та генеруємо HTML звіт
CMD ["npx", "playwright", "test", "--reporter", "html", "--output", "test-report"]
