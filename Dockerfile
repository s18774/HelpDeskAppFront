# Pull official base image
FROM node:14

# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm config set strict-ssl false
RUN npm install --silent

# Copy app source code
COPY . ./

# Install a lightweight web server (e.g., serve)
RUN npm install -g serve

# Build the app for production
RUN npm run build

# Expose port (default port for serve is 5000)
EXPOSE 5000

# Start the app using "serve" in production mode
CMD ["serve", "-s", "build"]

