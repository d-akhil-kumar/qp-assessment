FROM node:16-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install \
    && npm run build \
    && rm -rf node_modules \
    && npm install --production

CMD [ "npm", "start" ]