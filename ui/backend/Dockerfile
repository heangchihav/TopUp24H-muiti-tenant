# Stage 1: Build the static website
FROM node:18-alpine as builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy all source
COPY . .

# Build static site for web
RUN npx expo export --platform web

# Final image (scratch or used in CI/CD)
# We don't need this for running—just copying from /app/dist
