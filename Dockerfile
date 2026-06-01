FROM node:22-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm ci --legacy-peer-deps

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the application
CMD ["sh", "-c", "PORT=${PORT:-3000} node dist/server.js"]
