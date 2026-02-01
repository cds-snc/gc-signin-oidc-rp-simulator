# syntax=docker/dockerfile:1
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN mkdir -p build/src \
  && cp -R src/views build/src/views \
  && cp -R src/public build/src/public

FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/build ./build

EXPOSE 8080

# Simple healthcheck. Adjust path if your app exposes /health.
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1

CMD ["node", "build/src/rp-server.js"]
