# Pull official base image
FROM node:13.12.0-alpine

# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# Copy app source code
COPY . ./

# Build the app for production
RUN npm run build

# Install a lightweight web server (e.g., serve)
RUN npm install -g serve

# Expose port (default port for serve is 5000)
EXPOSE 5000

# Start the app using "serve" in production mode
CMD ["serve", "-s", "build"]

