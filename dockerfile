FROM node:15

WORKDIR /app

COPY . .

RUN npm install

# CMD ["npm", "server-dev"]
RUN node server/server.js