
FROM node:20-alpine

WORKDIR /app

# Update OS security packages
RUN apk upgrade --no-cache

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Remove global npm and npx after installation
RUN rm -rf /usr/local/lib/node_modules/npm \
    /usr/local/bin/npm \
    /usr/local/bin/npx

# Copy application
COPY src ./src

EXPOSE 8080

# Run application directly with Node.js
CMD ["node", "src/server.js"]
