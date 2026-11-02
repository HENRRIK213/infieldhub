FROM node:20

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client (using a dummy URL just for the build step)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Start command: push schema, seed, and start server
CMD ["sh", "-c", "npx prisma db push --accept-data-loss; node seed.js; node src/server.js"]