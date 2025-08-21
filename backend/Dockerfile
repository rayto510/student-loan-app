# backend/Dockerfile

# 1. Use Node 20 LTS
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY package.json yarn.lock ./

# 4. Install dependencies
RUN yarn install --frozen-lockfile

# 5. Copy the rest of the backend code
COPY . .

# 6. Build TypeScript to dist/
RUN yarn tsc

# 7. Expose backend port
EXPOSE 8080

# 8. Start the server from dist
CMD ["node", "dist/server.js"]
