FROM node:16-alpine3.17

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

COPY . .

RUN npm i

EXPOSE 8080

CMD [ "npm", "run", "start" ]