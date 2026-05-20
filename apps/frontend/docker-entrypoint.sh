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
  else
    API_UPSTREAM="http://backend:4000"
  fi
fi

export PORT API_UPSTREAM

envsubst '$PORT $API_UPSTREAM' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
