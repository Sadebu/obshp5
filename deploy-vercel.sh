#!/bin/bash

# Скрипт быстрого деплоя на Vercel
# Использование: ./deploy-vercel.sh

echo "🚀 Деплой игры СОЦИУМ на Vercel..."
echo ""

# Проверка наличия Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI не установлен."
    echo "Установите его командой: npm install -g vercel"
    exit 1
fi

# Сборка проекта
echo "📦 Сборка проекта..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Ошибка сборки!"
    exit 1
fi

echo "✅ Сборка завершена успешно!"
echo ""

# Деплой
echo "🌐 Деплой на Vercel..."
vercel --prod

echo ""
echo "✅ Деплой завершён!"
echo "🎮 Игра доступна по ссылке выше"
