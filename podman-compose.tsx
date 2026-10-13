version: '3.8'

services:
  postgres:
    image: postgres:16
    container_name: infieldhub-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: infieldhub
      POSTGRES_PASSWORD: infieldhub
      POSTGRES_DB: infieldhub
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U infieldhub"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7
    container_name: infieldhub-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
  redisdata: