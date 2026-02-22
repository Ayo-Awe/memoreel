# Builder stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build tools needed for native modules (bcrypt)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Runtime stage
FROM node:20-alpine AS runtime

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY migrations ./migrations
COPY init.sh ./init.sh

RUN chmod +x init.sh

EXPOSE 8080

CMD ["sh", "init.sh"]
