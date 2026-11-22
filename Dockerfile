FROM node:20-alpine

WORKDIR /app

RUN apk upgrade --no-cache

# Update npm to latest available version
RUN npm install -g npm@latest

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src

EXPOSE 8080

CMD ["npm", "start"]