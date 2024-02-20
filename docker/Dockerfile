FROM node:20-alpine3.18 as base

FROM base as deps-prod
WORKDIR /app

RUN mkdir -p /app
RUN npm i -g pnpm

COPY ./package.json ./pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

FROM base as builder
WORKDIR /app
COPY --from=deps-prod /app/node_modules /app/node_modules
COPY . /app

RUN pnpm build

FROM base as prod
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist /app/dist
COPY --from=deps-prod /app/node_modules /app/node_modules

EXPOSE 3000

CMD ["node", "/app/dist/index.js"]