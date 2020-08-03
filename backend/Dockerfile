FROM node:13-slim

RUN mkdir /app
RUN mkdir /app/node_modules
RUN mkdir /app/dist

WORKDIR /app

COPY dist/ ./dist
COPY package.json ./
COPY node_modules/ ./node_modules

CMD [ "node", "dist/main.js" ]
