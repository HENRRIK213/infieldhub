FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --include=dev

COPY . .

RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Sync DB, try to seed, and ALWAYS start the server
CMD ["sh", "-c", "npx prisma db push --accept-data-loss || true; node seed.js || true; node src/server.js"]