# version of node to use
FROM node:22
# Directory to save image
WORKDIR /app
# Install all dependencies
COPY package*.json ./
RUN npm install
# Bundle app source
COPY . .
# Expose port 3000
EXPOSE 3000
# Start the app
CMD ["npm", "run", "start"]
