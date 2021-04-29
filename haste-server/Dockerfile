FROM node:16-alpine

WORKDIR /usr/app/

COPY src/backend/ src/backend/
COPY dist/ dist/
COPY package.json .
COPY yarn.lock .
COPY README.md .

ENV NODE_ENV production
ENV HOST=0.0.0.0
ENV PORT=8290

RUN yarn --frozen-lockfile --no-bin-links

EXPOSE 8290

CMD ["yarn", "start"]
