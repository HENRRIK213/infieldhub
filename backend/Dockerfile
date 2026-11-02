FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --include=dev

COPY . .

# Generate Prisma Client (does not require a live database connection)
RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Push schema, seed, and start the server. 
# NOTE: RENDER MUST HAVE DATABASE_URL SET IN ITS ENVIRONMENT VARIABLES FOR THIS TO WORK.
CMD ["sh", "-c", "npx prisma db push --accept-data-loss; node seed.js; node src/server.js"]