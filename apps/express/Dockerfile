FROM node:20-alpine3.18 as os
RUN apk update
RUN apk add --no-cache libc6-compat

FROM os as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm config set store-dir ~/.pnpm-store
RUN pnpm add -g turbo

FROM base as pruned
WORKDIR /app
COPY . .
RUN turbo prune @app/express --docker

FROM base as builder
WORKDIR /app
COPY --from=pruned /app/out/json .
COPY --from=pruned /app/out/pnpm-lock.yaml  .
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install 

COPY --from=pruned /app/out/full .

RUN turbo build --no-cache --force --filter=@app/express...
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm prune --prod --no-optional

# Remove unnecessary files from the final image to reduce its size
RUN rm -rf ./packages/**/*/src
RUN rm -rf ./packages/**/*/__tests__
RUN rm -rf ./apps/*/src
RUN rm -rf ./apps/*/__tests__

FROM base as prod
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app .

EXPOSE 3000

CMD node apps/express/build/src/index.js

FROM base as dev
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile

EXPOSE 3000

CMD pnpm dev:express

FROM base as test
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install

CMD turbo test --force --no-cache --filter=@app/express...
