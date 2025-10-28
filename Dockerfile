# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of your source code
COPY . .

# Expose your app's port (adjust if needed)
EXPOSE 3000

# Start your app
CMD ["npm", "start"]
