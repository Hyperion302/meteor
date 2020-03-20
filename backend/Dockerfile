FROM node:13-slim

RUN mkdir /app

WORKDIR /app

COPY dist/ ./

CMD [ "node", "src/main.js" ]
