#!/bin/sh
set -e

: "${PORT:=80}"

if [ -z "${API_UPSTREAM:-}" ]; then
  if [ -n "${API_HOSTPORT:-}" ]; then
    # Strip leading http:// or https:// and trailing slash if user provided a full URL
    hostport=${API_HOSTPORT}
    # remove scheme if present
    hostport=${hostport#http://}
    hostport=${hostport#https://}
    # remove trailing slash
    hostport=${hostport%/}
    # preserve https if original had it
    case "${API_HOSTPORT}" in
      https://*) API_UPSTREAM="https://${hostport}" ;;
      *) API_UPSTREAM="http://${hostport}" ;;
    esac

    # Guardrail: avoid accidental self-proxy loop on Render frontend service
    if [ -n "${RENDER_EXTERNAL_HOSTNAME:-}" ]; then
      frontend_host=${RENDER_EXTERNAL_HOSTNAME%/}
      if [ "${hostport}" = "${frontend_host}" ] || [ "${hostport}" = "${frontend_host}:443" ]; then
        echo "ERROR: API_HOSTPORT points to this frontend host (${hostport})."
        echo "Set API_HOSTPORT to backend service host (e.g. smart-dashboard-backend:4000)."
        exit 1
      fi
    fi
  else
    API_UPSTREAM="http://backend:4000"
  fi
fi

export PORT API_UPSTREAM

envsubst '$PORT $API_UPSTREAM' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
