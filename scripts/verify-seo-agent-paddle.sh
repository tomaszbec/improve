#!/bin/sh
set -eu

set -a
. /opt/ai-tools-sandbox/.env
set +a

login_payload=$(jq -cn --arg email "$BOOTSTRAP_ADMIN_EMAIL" --arg password "$BOOTSTRAP_ADMIN_PASSWORD" '{email:$email,password:$password}')
login_response=$(curl -fsS -H 'Content-Type: application/json' --data "$login_payload" http://127.0.0.1:18180/auth/login)
token=$(printf '%s' "$login_response" | jq -er '.token')
umask 077
printf '%s' "$token" > /tmp/seo-agent-sandbox-token

me_status=$(curl -sS -o /tmp/seo-agent-me.json -w '%{http_code}' -H "Authorization: Bearer $token" http://127.0.0.1:18180/auth/me)
checkout_response=$(curl -fsS -H "Authorization: Bearer $token" -H 'Content-Type: application/json' --data '{"plan":"Starter","provider":"Paddle"}' http://127.0.0.1:18180/billing/checkout)
checkout_url=$(printf '%s' "$checkout_response" | jq -er '.url')

case "$checkout_url" in
  https://*.paddle.com/*) checkout_valid=yes ;;
  *) checkout_valid=no ;;
esac

printf 'auth_me_status=%s\n' "$me_status"
printf 'checkout_url_valid=%s\n' "$checkout_valid"
printf 'checkout_has_transaction=%s\n' "$(printf '%s' "$checkout_url" | grep -q '_ptxn=' && printf yes || printf no)"
