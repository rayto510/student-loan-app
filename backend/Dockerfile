# Example Dockerfile for backend
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies inside container
RUN yarn install --frozen-lockfile --force

# Copy the rest of the source code
COPY . .

# Build (if needed)
RUN yarn build

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "dist/server.js"]
