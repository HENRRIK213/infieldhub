FROM node:20-slim

WORKDIR /app

# Install system build tools required for native dependencies (sharp, bcrypt)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (this will now compile native modules successfully)
RUN npm install

COPY . .

# Generate Prisma Client (using a dummy URL just for the build step)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Start command: push schema, seed, and start server
CMD ["sh", "-c", "npx prisma db push --accept-data-loss; node seed.js; node src/server.js"]