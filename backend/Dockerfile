FROM node:20-alpine

# Install system build tools required for native dependencies like bcrypt and sharp
RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Use npm ci for a clean, deterministic install
RUN npm ci --include=dev

COPY . .

# Generate Prisma Client (using a dummy URL just for the build step)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Start command: push schema, seed, and start server
CMD ["sh", "-c", "npx prisma db push --accept-data-loss; node seed.js; node src/server.js"]