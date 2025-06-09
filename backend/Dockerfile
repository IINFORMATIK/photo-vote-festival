
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p uploads data

# Expose port
EXPOSE 4080

# Start the server
CMD ["npm", "start"]
