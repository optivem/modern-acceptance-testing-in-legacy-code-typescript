FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy built application
COPY dist ./dist
COPY src/public ./dist/public

# Expose port
EXPOSE 8082

# Start the application
CMD ["node", "dist/server.js"]
