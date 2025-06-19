# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

# Use a consistent environment for reproducibility
WORKDIR /app

# Copy dependency descriptors first
COPY package*.json ./

# Faster and reproducible install if package-lock.json exists
RUN npm ci

# Copy the rest of the app
COPY . .

# Build the frontend (React, Vue, etc.)
RUN npm run build


# ---------- Stage 2: Serve with nginx ----------
FROM nginx:stable-alpine

# Copy the build output to NGINX's default public directory
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: remove default nginx.conf and copy custom one if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
