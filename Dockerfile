# Use Node.js LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for Expo
RUN apk add --no-cache \
    git \
    bash \
    curl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose Expo ports
EXPOSE 19000 19001 19002

# Set environment variable to allow external connections
ENV EXPO_HOST=0.0.0.0

# Start Expo server
CMD ["npm", "start"]
