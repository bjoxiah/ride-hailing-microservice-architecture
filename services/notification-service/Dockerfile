FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install dependencies (uses pnpm store)
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

ENV NODE_ENV=production

CMD ["pnpm", "start"]
