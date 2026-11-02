FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --include=dev
COPY . .
# Generate Prisma Client using a temporary dummy URL (does NOT persist at runtime)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate
ENV NODE_ENV=production
ENV PORT=10000
EXPOSE 10000
# At runtime, Render's DATABASE_URL will be used
CMD ["sh", "-c", "npx prisma db push --accept-data-loss; node seed.js; node src/server.js"]