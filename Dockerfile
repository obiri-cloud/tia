# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Build your Next.js application
RUN npm run build

# Expose the port your application will run on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "run", "start"]