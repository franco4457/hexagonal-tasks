FROM node:18-alpine AS base

RUN npm i -g pnpm
RUN mkdir -p /home/app

WORKDIR /home/app

EXPOSE 3000


FROM base AS dev
COPY --from=base /home/app /home/app

CMD ["pnpm", "dev:express"]

FROM base AS test
COPY --from=base /home/app /home/app

CMD [ "pnpm", "test" ]