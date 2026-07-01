FROM node:latest

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV PORT 8080

ENV HOST 0.0.0.0

RUN npx prisma generate

CMD [ "node", "./index.js" ]

EXPOSE 8080