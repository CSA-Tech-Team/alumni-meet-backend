FROM node:20

WORKDIR /app

RUN npm i nestjs
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["yarn", "start", "start"]
