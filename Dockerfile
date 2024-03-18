FROM node:20-alpine

ENV NODE_ENV="production"
ENV PORT=2114

WORKDIR /workspace

RUN apk add --no-cache dumb-init

EXPOSE 2114

COPY --chown=node:node . .

RUN yarn install --immutable

RUN yarn build

USER node

ENTRYPOINT ["dumb-init", "--"]

CMD [ "yarn", "run", "start"]
