FROM node:latest

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

ENV PORT 8080

ENV HOST 0.0.0.0

RUN yarn prisma generate

CMD [ "node", "./src/index.js" ]

EXPOSE 8080