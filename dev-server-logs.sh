tmux \
    new session -d -s logs \; \
    split-window "docker compose logs -f proxy-server" \; \
    split-window "docker compose -f docker-compose.yml -f compose.dev.yml logs -f proxy-server-ts-watcher" \; \
    select-layout even-vertical