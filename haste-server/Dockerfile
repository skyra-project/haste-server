# ================ #
#    Base Stage    #
# ================ #

FROM node:19-alpine as base

WORKDIR /usr/app/

ENV HUSKY=0
ENV CI=true

RUN apk add --no-cache dumb-init python3 make g++

COPY --chown=node:node yarn.lock .
COPY --chown=node:node package.json .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node README.md .
COPY --chown=node:node .yarn/ .yarn/

RUN sed -i 's/"prepare": "husky install .github\/husky"/"prepare": ""/' ./package.json

ENTRYPOINT ["dumb-init", "--"]

# ================ #
#   Builder Stage  #
# ================ #

FROM base as builder

ENV NODE_ENV="development"

COPY --chown=node:node tsconfig.json tsconfig.json
COPY --chown=node:node src/ src/
COPY --chown=node:node scripts/ scripts/

RUN yarn install --immutable
RUN yarn run build

# ================ #
#   Runner Stage   #
# ================ #

FROM base AS runner

ENV NODE_ENV="production"
ENV NODE_OPTIONS="--enable-source-maps"
ENV HOST=0.0.0.0
ENV PORT=8290

COPY --chown=node:node --from=builder /usr/app/dist dist
COPY --chown=node:node --from=builder /usr/app/src/backend src/backend

RUN yarn workspaces focus --all --production

EXPOSE 8290

USER node

CMD [ "yarn", "run", "start"]
