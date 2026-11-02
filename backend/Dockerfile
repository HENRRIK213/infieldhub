# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install build tools for native modules (bcrypt, sharp)
RUN apk add --no-cache python3 make g++ openssl

COPY package*.json ./
COPY prisma ./prisma/

# Use npm ci for a deterministic, memory-efficient install
RUN npm ci --no-audit --no-fund

COPY . .

# Generate Prisma Client (dummy URL used only for build validation)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# --- Stage 2: Production Runtime ---
FROM node:20-alpine
WORKDIR /app

# Limit Node's memory to prevent OOM on Render's 512MB tier
ENV NODE_OPTIONS="--max-old-space-size=400"
ENV NODE_ENV=production
ENV PORT=10000

# Copy only the necessary artifacts from the build stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/seed.js ./

EXPOSE 10000

# Push schema, seed, and start server (runtime environment variables are used here)
CMD ["sh", "-c", "npx prisma db push --accept-data-loss; node seed.js; node src/server.js"]