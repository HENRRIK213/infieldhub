FROM node:20-alpine

# Limit memory to prevent OOM on Render's 512MB free tier
ENV NODE_OPTIONS="--max-old-space-size=400"

# Install build tools for bcrypt/sharp and openssl for Prisma
RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Use npm ci for deterministic, memory-efficient install
RUN npm ci --no-audit --no-fund

COPY . .

# Generate Prisma Client for Alpine
RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Push schema to DB, seed the admin user, and start the server
CMD ["sh", "-c", "npx prisma db push --accept-data-loss; node seed.js; node src/server.js"]