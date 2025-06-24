# Use official Node.js image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of backend files
COPY . .

# Expose backend port (e.g., 3000)
EXPOSE 3000

# Start backend
CMD ["npm", "start"]
