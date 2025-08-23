FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for frontend
COPY src/frontend/package.json src/frontend/package-lock.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY src/frontend/ .

# Build the frontend
RUN npm run build

# Copy package.json and package-lock.json for backend
COPY src/backend/package.json src/backend/package-lock.json ./backend/

# Install backend dependencies
RUN npm install --prefix ./backend

# Copy backend source code
COPY src/backend/ ./backend/

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start", "--prefix", "./backend"]