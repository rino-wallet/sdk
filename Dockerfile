ARG NODE_VERSION="${NODE_VERSION:-16.20.2}"
FROM node:${NODE_VERSION}-buster-slim AS build-stage

WORKDIR /app
COPY . .

RUN yarn install --frozen-lockfile \
    && yarn build

FROM node:${NODE_VERSION}-buster-slim AS runtime-stage

ARG USERID=1000
RUN mkdir -p /app

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/node_modules /app/node_modules

EXPOSE 3000
USER ${USERID}

CMD ["node", "app/main"]
