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

# This command force-syncs the database schema and runs the seed script
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node seed.js && node src/server.js"]