FROM node:20-slim

# Install system dependencies required for Prisma and native modules (bcrypt/sharp)
RUN apt-get update && apt-get install -y \
    openssl \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

COPY . .

# Generate Prisma Client (using a dummy URL for the build step)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Push schema, seed, and start server
CMD ["sh", "-c", "npx prisma db push --accept-data-loss; node seed.js; node src/server.js"]