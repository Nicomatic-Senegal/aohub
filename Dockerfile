# Stage 1: Build the Angular application
FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . /app

EXPOSE 4200

CMD ["npm", "run", "start"]
