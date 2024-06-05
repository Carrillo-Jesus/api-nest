FROM node:20.13-alpine

WORKDIR /app

COPY ./dist ./dist
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]