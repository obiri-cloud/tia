# Use Node.js as the base image
FROM node:14 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire application to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Use a lightweight Node.js image for production
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --production

# Set environment variables if needed
# ENV NODE_ENV=production

# Expose the port your Next.js app runs on (default is 3000)
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
