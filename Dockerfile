FROM node:14-alpine

WORKDIR /usr/src/app-devops

COPY . .

RUN npm install

EXPOSE 3000