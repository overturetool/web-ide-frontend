FROM node

ADD . /app
WORKDIR /app

RUN node docker-build.js
RUN npm install
RUN npm run tsc; exit 0

CMD npm run serve