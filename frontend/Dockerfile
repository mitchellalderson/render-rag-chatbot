# Multi-stage build for React frontend
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package files for workspace
COPY package*.json ./

# Copy common-ui package
COPY common-ui ./common-ui

# Copy frontend package files
COPY rag-chatbot/frontend/package*.json ./rag-chatbot/frontend/

# Install dependencies from root (workspace aware)
RUN npm ci

# Copy frontend source code
COPY rag-chatbot/frontend ./rag-chatbot/frontend

# Build common-ui first
WORKDIR /app/common-ui
RUN npm run build

# Build the frontend application
WORKDIR /app/rag-chatbot/frontend

# Accept VITE_API_URL as build argument
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/rag-chatbot/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY rag-chatbot/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
