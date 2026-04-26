# Stage 1: Install dependencies
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

USER appuser

EXPOSE 5001

CMD ["node", "src/server.js"]
