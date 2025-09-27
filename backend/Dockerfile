# Use Node.js 20 Alpine for Manifest backend (required by Manifest)
FROM node:20-alpine

# Install git for potential cloning needs
RUN apk add --no-cache git

# Create app directory
WORKDIR /app

# Copy package files and install Manifest CLI
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Manifest CLI is included in the manifest package - no global install needed

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy Manifest backend files
COPY . .

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Set required environment variables for Manifest
ENV NODE_ENV=production
ENV TOKEN_SECRET_KEY=manifest-secret-key-25826262-2879-432c-88c9-7ab9fcb24ea8

# Expose port (Manifest runs on 1111)
EXPOSE 1111

# Health check for Manifest backend
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:1111/api/health', (res) => { \
    process.exit(res.statusCode === 200 ? 0 : 1) \
  }).on('error', () => process.exit(1))"

# Start the Manifest backend
CMD ["npm", "start"]