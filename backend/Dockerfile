FROM node:13-slim

RUN mkdir /app
RUN mkdir /app/node_modules

WORKDIR /app

COPY dist/ ./
COPY package.json ./
COPY node_modules/ ./node_modules

CMD [ "node", "src/main.js" ]
