FROM --platform=linux/amd64 node:17-alpine

RUN apk add --no-cache dumb-init

WORKDIR /usr/app/

COPY --chown=node:node src/backend/ src/backend/
COPY --chown=node:node dist/ dist/
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node README.md .

ENV NODE_ENV production
ENV HOST=0.0.0.0
ENV PORT=8290

RUN yarn --frozen-lockfile --no-bin-links

EXPOSE 8290

USER node

CMD [ "dumb-init", "yarn", "start" ]
