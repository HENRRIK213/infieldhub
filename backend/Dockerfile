FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --include=dev

COPY . .

RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dummy" npx prisma generate

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

CMD ["sh", "-c", "npx prisma migrate deploy && node seed.js && node src/server.js"]
