FROM node:14-alpine

WORKDIR /usr/src/app-devops

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

# To launch the tests before the server
# CMD sh -c "npm test && npm start"