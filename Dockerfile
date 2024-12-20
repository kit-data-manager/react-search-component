FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . /usr/src/app/

RUN npm run build-storybook
RUN npm i -g serve

EXPOSE 6006

CMD ["serve", "./storybook-static", "-p", "6006"]