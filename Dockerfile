FROM node:20-alpine

WORKDIR /app

RUN apk upgrade --no-cache

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src

EXPOSE 8080

CMD ["npm", "start"]