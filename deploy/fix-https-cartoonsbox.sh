#!/bin/bash
# Fix HTTPS for cartoonsbox.com ONLY — does not touch any other nginx site.
# Run as root: bash /var/www/vasnumero/cartoon_MTN_CLI/deploy/fix-https-cartoonsbox.sh

set -euo pipefail

PROJECT_DIR="/var/www/vasnumero/cartoon_MTN_CLI"
NGINX_SITE="cartoonsbox.com.conf"
NGINX_AVAILABLE="/etc/nginx/sites-available/${NGINX_SITE}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${NGINX_SITE}"
CERT_DIR="/etc/letsencrypt/live/cartoonsbox.com"

echo "==> Step 1: Check if another site wrongly owns cartoonsbox.com..."
CONFLICTS=$(grep -rl "cartoonsbox\.com" /etc/nginx/sites-enabled/ 2>/dev/null | grep -v "${NGINX_SITE}" || true)
if [ -n "${CONFLICTS}" ]; then
  echo ""
  echo "ERROR: cartoonsbox.com is also listed in these nginx configs:"
  echo "${CONFLICTS}"
  echo ""
  echo "Open each file and REMOVE only 'cartoonsbox.com' and 'www.cartoonsbox.com'"
  echo "from the server_name line. Do NOT change anything else in those files."
  echo ""
  echo "Example: nano /etc/nginx/sites-enabled/<poker365-config>"
  echo "Then re-run this script."
  exit 1
fi

echo "    OK — no conflicts found."

echo "==> Step 2: Install HTTP-only config (for certbot challenge)..."
cat > "${NGINX_AVAILABLE}" << 'HTTPEOF'
server {
    listen 80;
    listen [::]:80;
    server_name cartoonsbox.com www.cartoonsbox.com;

    root /var/www/vasnumero/cartoon_MTN_CLI/dist;
    index index.html;

    location /.well-known/acme-challenge/ {
        root /var/www/vasnumero/cartoon_MTN_CLI/dist;
    }

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

ln -sf "${NGINX_AVAILABLE}" "${NGINX_ENABLED}"
nginx -t
systemctl reload nginx

echo "==> Step 3: Get SSL certificate (cartoonsbox.com ONLY)..."
if [ ! -f "${CERT_DIR}/fullchain.pem" ]; then
  certbot certonly --webroot \
    -w "${PROJECT_DIR}/dist" \
    -d cartoonsbox.com \
    -d www.cartoonsbox.com \
    --non-interactive \
    --agree-tos \
    --register-unsafely-without-email
else
  echo "    Certificate already exists, renewing if needed..."
  certbot renew --quiet || true
fi

echo "==> Step 4: Install full HTTPS nginx config..."
cp "${PROJECT_DIR}/deploy/${NGINX_SITE}" "${NGINX_AVAILABLE}"
ln -sf "${NGINX_AVAILABLE}" "${NGINX_ENABLED}"

echo "==> Step 5: Test and reload nginx..."
nginx -t
systemctl reload nginx

echo ""
echo "HTTPS fix complete!"
echo "  https://cartoonsbox.com"
echo "  https://cartoonsbox.com/?subid=253393254&productcode=NICB"
