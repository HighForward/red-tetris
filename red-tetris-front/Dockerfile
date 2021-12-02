FROM node:16

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3000
ENV HOST 0.0.0.0

CMD npm run dev