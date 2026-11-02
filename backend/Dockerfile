FROM node:20-alpine

# Limit Node's memory usage to prevent OOM on Render's 512MB free tier
ENV NODE_OPTIONS="--max-old-space-size=400"

# Install ONLY the essential build tools required for bcrypt
RUN apk add --no-cache python3 make g++ openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Use npm ci for a deterministic install and limit memory during install
RUN npm ci --no-audit --no-fund

COPY . .

# Generate Prisma Client for Alpine
RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Push schema, seed, and start server (kept in CMD for free tier)
CMD ["sh", "-c", "npx prisma db push --accept-data-loss; node seed.js; node src/server.js"]