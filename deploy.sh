#!/usr/bin/env bash

# Деплой из локальной сети: сервер в той же подсети, поэтому без CI, напрямую по SSH.
# На сервер уезжает закоммиченный HEAD, а не рабочая папка: иначе локальные dev-секреты
# из secrets/, node_modules и неверсионируемый calc-server/ затрут серверные.
#
#   ./deploy.sh
#   DEPLOY_USER=admin ./deploy.sh

set -euo pipefail

HOST="${DEPLOY_HOST:-192.168.1.49}"
PORT="${DEPLOY_PORT:-22}"
USER_NAME="${DEPLOY_USER:-$USER}"
DIR=/mnt/tank/matli/material_request
COMPOSE="sudo docker compose -f compose.prod.yaml"

cd "$(dirname "$0")"

if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  echo "Есть незакоммиченные изменения — они НЕ уедут, деплоится $(git rev-parse --short HEAD)" >&2
fi

echo "→ Заливаю $(git rev-parse --short HEAD) на $USER_NAME@$HOST:$DIR"
git archive --format=tar HEAD | ssh -p "$PORT" "$USER_NAME@$HOST" "tar -x -C $DIR"

# Сначала собираем, потом пересоздаём: контейнеры меняются, только когда новые образы
# готовы, и сайт не лежит всё время сборки. -t — чтобы sudo мог спросить пароль.
echo "→ Пересобираю и перезапускаю контейнеры"
ssh -t -p "$PORT" "$USER_NAME@$HOST" "set -e; cd $DIR \
  && $COMPOSE pull calc-server \
  && $COMPOSE build \
  && $COMPOSE up -d --remove-orphans \
  && sudo docker image prune -f \
  && $COMPOSE ps"

echo "✓ Готово"
