#!/bin/sh
set -eu

set -a
. /opt/ai-tools-sandbox/.env
set +a

user_id=$(docker exec ai-tools-sandbox-postgres-1 psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Atc "SELECT id FROM users WHERE lower(email)=lower('$BOOTSTRAP_ADMIN_EMAIL') LIMIT 1")
test -n "$user_id"

event_id="evt_sandbox_verify_$(date +%s)"
occurred_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)
body=$(jq -cn \
  --arg event_id "$event_id" \
  --arg occurred_at "$occurred_at" \
  --arg user_id "$user_id" \
  '{event_id:$event_id,event_type:"transaction.completed",occurred_at:$occurred_at,data:{id:("txn_sandbox_verify_"+$event_id),status:"completed",subscription_id:("sub_sandbox_verify_"+$event_id),custom_data:{seo_agent_user_id:$user_id,seo_agent_plan:"Starter"}}}')
timestamp=$(date +%s)
signature=$(printf '%s:%s' "$timestamp" "$body" | openssl dgst -sha256 -hmac "$PADDLE_WEBHOOK_SECRET" -hex | awk '{print $NF}')

first_status=$(curl -sS -o /tmp/paddle-webhook-first -w '%{http_code}' -H 'Content-Type: application/json' -H "Paddle-Signature: ts=$timestamp;h1=$signature" --data "$body" https://improveit.pl/api/webhooks/paddle)
second_status=$(curl -sS -o /tmp/paddle-webhook-second -w '%{http_code}' -H 'Content-Type: application/json' -H "Paddle-Signature: ts=$timestamp;h1=$signature" --data "$body" https://improveit.pl/api/webhooks/paddle)
event_count=$(docker exec ai-tools-sandbox-postgres-1 psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Atc "SELECT count(*) FROM billing_events WHERE event_id='$event_id' AND provider='Paddle'")
subscription_state=$(docker exec ai-tools-sandbox-postgres-1 psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Atc "SELECT plan || ':' || status || ':' || provider FROM subscriptions WHERE user_id=$user_id")

printf 'first_status=%s\n' "$first_status"
printf 'duplicate_status=%s\n' "$second_status"
printf 'idempotent_event_count=%s\n' "$event_count"
printf 'subscription_state=%s\n' "$subscription_state"
