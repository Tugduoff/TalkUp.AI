# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the server
RUN npm run build:server

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install production dependencies only
RUN npm ci --omit=dev --legacy-peer-deps

# Copy built application from builder
COPY --from=builder /app/server/dist ./server/dist

# Expose port (Railway will override with PORT env var)
EXPOSE 3000

# Run the application directly with Node
CMD ["node", "server/dist/src/main"]
