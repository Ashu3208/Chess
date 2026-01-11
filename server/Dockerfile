FROM node:20-bookworm-slim AS deps
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy deps and app source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Default; can be overridden via SERVER_PORT
EXPOSE 3000

CMD ["node", "index.js"]


