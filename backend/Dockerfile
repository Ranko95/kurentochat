FROM node:16.11.1-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . /app

RUN npm run build

ENTRYPOINT ["npm", "start"]
