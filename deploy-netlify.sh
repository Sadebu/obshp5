#!/bin/bash

# Скрипт быстрого деплоя на Netlify
# Использование: ./deploy-netlify.sh

echo "🚀 Деплой игры СОЦИУМ на Netlify..."
echo ""

# Проверка наличия Netlify CLI
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI не установлен."
    echo "Установите его командой: npm install -g netlify-cli"
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
echo "🌐 Деплой на Netlify..."
netlify deploy --prod --dir=dist

echo ""
echo "✅ Деплой завершён!"
echo "🎮 Игра доступна по ссылке выше"
