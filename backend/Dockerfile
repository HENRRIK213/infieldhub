FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --include=dev
COPY . .
# Generate the Prisma Client for the current platform (Alpine)
RUN npx prisma generate
ENV NODE_ENV=production
ENV PORT=10000
EXPOSE 10000
# Push schema to DB, seed, and start server
CMD ["sh", "-c", "npx prisma db push --accept-data-loss; node seed.js; node src/server.js"]