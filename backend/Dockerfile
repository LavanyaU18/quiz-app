FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Explicitly start the application since there's no start script in package.json
CMD ["node", "server.js"]
