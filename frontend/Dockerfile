# frontend/Dockerfile

# Use Node 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy frontend source
COPY . .

# Build Next.js app
RUN yarn build

# Expose frontend port
EXPOSE 3000

# Start Next.js in production mode
CMD ["yarn", "start"]
