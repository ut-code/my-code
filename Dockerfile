# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile をベースに

FROM node:lts-slim AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/jsEval/package.json ./packages/jsEval/
COPY packages/runtime/package.json ./packages/runtime/

RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# これだけ時間かかるので先に実行する
WORKDIR /app
COPY ./scripts ./scripts
RUN mkdir app && npx tsx ./scripts/removeHinting.ts

FROM node:lts-slim AS builder

# ビルド中にsentryでソースマップをアップロードするのに必要
RUN apt-get update && apt-get install -y ca-certificates

# Set working directory
WORKDIR /app

# Copy project dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source code
COPY . .

COPY --from=dependencies /app/app/m-plus-rounded-1c-nohint ./app/m-plus-rounded-1c-nohint

# Stop if documentation has any change that is not reflected to revisions.yml and database.
RUN npx tsx ./scripts/checkDocs.ts --check-diff

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

FROM node:lts-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the run time.
# ENV NEXT_TELEMETRY_DISABLED=1

# Copy production assets
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Switch to non-root user for security best practices
USER node

# Expose port 3000 to allow HTTP traffic
EXPOSE 3000

# Start Next.js standalone server
CMD ["node", "server.js"]
