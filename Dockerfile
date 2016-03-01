FROM node

ADD . /app
WORKDIR /app

RUN node docker-build.js
RUN npm install

CMD npm run start