# Stage 1: Build the Angular application
FROM node:18 as build-stage

WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . /app

# Build the application for production
RUN npm run build -- --output-path=./dist/out

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the built application from the build stage to the Nginx serve directory
COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html

# Copy a custom nginx configuration if you have one, or use the default
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the Docker host, so we can access the application
EXPOSE 80

# The default command runs Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
