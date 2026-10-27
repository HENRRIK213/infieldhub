FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and Prisma schema first
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --include=dev

# Copy the rest of the application
COPY . .

# Generate Prisma Client AFTER the schema is in place
RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

CMD ["sh", "-c", "npx prisma db push --accept-data-loss || true; node seed.js || true; node src/server.js"]
