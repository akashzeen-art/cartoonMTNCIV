#!/bin/bash
# Deploy cartoonMTNCIV to cartoonsbox.com
# Run on server as root: bash /var/www/vasnumero/cartoonMTN_CLI/deploy/deploy-cartoonsbox.sh

set -euo pipefail

PROJECT_DIR="/var/www/vasnumero/cartoonMTN_CLI"
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
cp "${PROJECT_DIR}/deploy/${NGINX_SITE}" "${NGINX_AVAILABLE}"
if [ ! -L "${NGINX_ENABLED}" ]; then
  ln -s "${NGINX_AVAILABLE}" "${NGINX_ENABLED}"
fi

echo "==> Testing nginx config..."
nginx -t

echo "==> Reloading nginx..."
systemctl reload nginx

echo ""
echo "Deploy complete!"
echo "  Site:  http://cartoonsbox.com"
echo "  Root:  ${PROJECT_DIR}/dist"
echo ""
echo "DNS for cartoonsbox.com should point to 160.187.80.197"
echo "HTTPS: certbot --nginx -d cartoonsbox.com -d www.cartoonsbox.com"
