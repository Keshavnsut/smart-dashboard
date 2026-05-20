#!/bin/sh
set -e

: "${PORT:=80}"

if [ -z "${API_UPSTREAM:-}" ]; then
  if [ -n "${API_HOSTPORT:-}" ]; then
    API_UPSTREAM="http://${API_HOSTPORT}"
  else
    API_UPSTREAM="http://backend:4000"
  fi
fi

export PORT API_UPSTREAM

envsubst '$PORT $API_UPSTREAM' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
