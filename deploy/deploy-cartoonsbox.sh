#!/bin/bash
# Deploy cartoonMTNCIV to cartoonsbox.com
# Run on server as root: bash /var/www/vasnumero/cartoon_MTN_CLI/deploy/deploy-cartoonsbox.sh

set -euo pipefail

PROJECT_DIR="/var/www/vasnumero/cartoon_MTN_CLI"
REPO_URL="https://github.com/akashzeen-art/cartoonMTNCIV.git"
NGINX_SITE="cartoonsbox.com.conf"
NGINX_AVAILABLE="/etc/nginx/sites-available/${NGINX_SITE}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${NGINX_SITE}"

echo "==> Checking Node.js..."
if ! command -v node &>/dev/null; then
  echo "ERROR: Node.js is not installed. Install Node 18+ first."
  exit 1
fi
echo "    Node $(node -v), npm $(npm -v)"

echo "==> Pulling latest code..."
mkdir -p /var/www/vasnumero
if [ ! -d "${PROJECT_DIR}/.git" ]; then
  git clone "${REPO_URL}" "${PROJECT_DIR}"
fi
cd "${PROJECT_DIR}"
git fetch origin
git reset --hard origin/main

echo "==> Installing dependencies..."
npm ci

echo "==> Building production bundle..."
npm run build

echo "==> Installing nginx site config (cartoonsbox.com only)..."
if [ -f "/etc/letsencrypt/live/cartoonsbox.com/fullchain.pem" ]; then
  cp "${PROJECT_DIR}/deploy/${NGINX_SITE}" "${NGINX_AVAILABLE}"
else
  echo "    SSL cert not found — installing HTTP config. Run fix-https-cartoonsbox.sh after deploy."
  cat > "${NGINX_AVAILABLE}" << 'HTTPEOF'
server {
    listen 80;
    listen [::]:80;
    server_name cartoonsbox.com www.cartoonsbox.com;

    root /var/www/vasnumero/cartoon_MTN_CLI/dist;
    index index.html;

    location /adpoke/ {
        proxy_pass http://68.183.88.91;
        proxy_http_version 1.1;
        proxy_set_header Host 68.183.88.91;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
HTTPEOF
fi
ln -sf "${NGINX_AVAILABLE}" "${NGINX_ENABLED}"

echo "==> Testing nginx config..."
nginx -t

echo "==> Reloading nginx..."
systemctl reload nginx

echo ""
echo "Deploy complete!"
echo "  Site:  http://cartoonsbox.com"
echo "  Root:  ${PROJECT_DIR}/dist"
echo ""
if [ ! -f "/etc/letsencrypt/live/cartoonsbox.com/fullchain.pem" ]; then
  echo "HTTPS fix (run once): bash ${PROJECT_DIR}/deploy/fix-https-cartoonsbox.sh"
fi
