# 🚀 Инструкция по деплою игры "СОЦИУМ"

## Содержание
1. [Netlify (рекомендуется)](#netlify)
2. [Vercel](#vercel)
3. [GitHub Pages](#github-pages)
4. [Собственный сервер](#own-server)

---

## <a name="netlify"></a>🟢 Способ 1: Netlify (самый простой)

### Вариант A: Drag & Drop (без Git)

1. **Соберите проект:**
   ```bash
   npm run build
   ```

2. **Откройте Netlify:**
   - Перейдите на [app.netlify.com/drop](https://app.netlify.com/drop)
   - Войдите через GitHub, GitLab или email

3. **Загрузите файлы:**
   - Перетащите папку `dist` на страницу Netlify
   - Дождитесь загрузки (10-30 секунд)

4. **Получите ссылку:**
   - Netlify автоматически создаст ссылку вида: `https://random-name-12345.netlify.app`
   - Нажмите "Site settings" → "Change site name" → задайте имя, например: `socicum-game`
   - Ваша ссылка: `https://socicum-game.netlify.app`

### Вариант B: Через Git (автоматические обновления)

1. **Создайте репозиторий на GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ваш-username/socicum-game.git
   git push -u origin main
   ```

2. **Подключите к Netlify:**
   - Откройте [app.netlify.com](https://app.netlify.com)
   - Нажмите "Add new site" → "Import an existing project"
   - Выберите GitHub и ваш репозиторий
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Нажмите "Deploy site"

3. **Готово!** При каждом push в GitHub сайт будет обновляться автоматически.

---

## <a name="vercel"></a>🔵 Способ 2: Vercel

### Вариант A: Через веб-интерфейс

1. **Соберите проект:**
   ```bash
   npm run build
   ```

2. **Откройте Vercel:**
   - Перейдите на [vercel.com](https://vercel.com)
   - Войдите через GitHub, GitLab или email

3. **Импортируйте проект:**
   - Нажмите "Add New..." → "Project"
   - Выберите ваш GitHub репозиторий
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Нажмите "Deploy"

### Вариант B: Через CLI

1. **Установите Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Задеплойте:**
   ```bash
   vercel login
   vercel
   ```

3. **Следуйте инструкциям:**
   - Set up and deploy? → `Y`
   - Which scope? → выберите ваш аккаунт
   - Link to existing project? → `N`
   - Project name → `socicum-game`
   - Directory → `./`
   - Override settings? → `N`

4. **Production деплой:**
   ```bash
   vercel --prod
   ```

---

## <a name="github-pages"></a>⚫ Способ 3: GitHub Pages

1. **Соберите проект:**
   ```bash
   npm run build
   ```

2. **Создайте репозиторий на GitHub**

3. **Загрузите файлы:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ваш-username/socicum-game.git
   git push -u origin main
   ```

4. **Настройте GitHub Pages:**
   - Откройте репозиторий на GitHub
   - Перейдите в Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `main` / `root` (или создайте branch `gh-pages` с содержимым `dist`)
   - Нажмите "Save"

5. **Альтернатива: используйте GitHub Actions**

   Создайте файл `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build
           run: npm run build
           
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

6. **Получите ссылку:**
   - `https://ваш-username.github.io/socicum-game/`

---

## <a name="own-server"></a>🟡 Способ 4: Собственный сервер

### Nginx

1. **Соберите проект:**
   ```bash
   npm run build
   ```

2. **Скопируйте файлы на сервер:**
   ```bash
   scp -r dist/* user@your-server:/var/www/socicum/
   ```

3. **Настройте Nginx:**
   ```nginx
   server {
       listen 80;
       server_name socicum.your-domain.com;
       root /var/www/socicum;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires max;
           log_not_found off;
       }
   }
   ```

4. **Перезапустите Nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

### Apache

1. **Скопируйте файлы:**
   ```bash
   scp -r dist/* user@your-server:/var/www/socicum/
   ```

2. **Настройте Apache:**
   ```apache
   <VirtualHost *:80>
       ServerName socicum.your-domain.com
       DocumentRoot /var/www/socicum

       <Directory /var/www/socicum>
           Options Indexes FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>

       ErrorLog ${APACHE_LOG_DIR}/socicum_error.log
       CustomLog ${APACHE_LOG_DIR}/socicum_access.log combined
   </VirtualHost>
   ```

3. **Создайте `.htaccess` в папке `/var/www/socicum/`:**
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

---

## 🔧 Дополнительные настройки

### Добавление SSL (HTTPS)

**Netlify/Vercel:**
- SSL включается автоматически и бесплатно

**Собственный сервер (Let's Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d socicum.your-domain.com
```

### Кастомный домен

**Netlify:**
1. Site settings → Domain management → Add custom domain
2. Следуйте инструкциям для настройки DNS

**Vercel:**
1. Project Settings → Domains
2. Добавьте ваш домен
3. Настройте DNS записи

**GitHub Pages:**
1. Settings → Pages → Custom domain
2. Введите ваш домен
3. Настройте DNS записи у регистратора

---

## 📊 Мониторинг и аналитика

### Netlify Analytics
- Включите в Site settings → Analytics
- Показывает посещения, популярные страницы

### Vercel Analytics
- Автоматически включено
- Детальная статистика в дашборде

### Google Analytics
Добавьте в `index.html` перед `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔄 Автоматические обновления

### GitHub Actions (автоматический деплой при push)

Создайте `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install & Build
        run: |
          npm ci
          npm run build
          
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './dist'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 🆘 Решение проблем

### Проблема: "Page not found" при обновлении страницы
**Решение:** Убедитесь, что настроены redirects (см. `netlify.toml` или `vercel.json`)

### Проблема: Стили/скрипты не загружаются
**Решение:** Проверьте пути в `index.html`, используйте относительные пути

### Проблема: Белый экран
**Решение:** Откройте консоль браузера (F12) и проверьте ошибки JavaScript

### Проблема: Не сохраняются данные
**Решение:** LocalStorage может быть отключён. Проверьте настройки браузера

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте консоль браузера (F12 → Console)
2. Очистите кэш (Ctrl+Shift+Del)
3. Попробуйте другой браузер
4. Проверьте, что JavaScript включён

---

**Удачи с деплоем! 🚀**
