# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container to /
WORKDIR /

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Expose port 8082 to the outside world
EXPOSE 8082

# Define the command to run your app
CMD ["node", "app.js"]
