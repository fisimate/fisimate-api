FROM node:16-alpine3.17

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

ENV PORT 8080

ENV HOST 0.0.0.0

CMD [ "node", "./src/index.js" ]

EXPOSE 8080