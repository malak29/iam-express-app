FROM node:18-alpine

WORKDIR /app

# Copy package files from parent directory
COPY ../package*.json ./
RUN npm install

# Copy environment file
COPY ../.env ./

# Copy source code from parent directory
COPY ../src ./src
COPY ../tsconfig.json ./

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]