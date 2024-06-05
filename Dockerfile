FROM node:20.9-alpine3.17

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 8080

CMD [ "yarn", "start" ]