# Stage 1: Build Frontend
FROM node:18-alpine AS build
WORKDIR /app

# Build arguments for Vite variables baked at compile time
ARG VITE_API_BASE_URL=/api
ARG VITE_APP_NAME="SmartPlacement AI"
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_NAME=$VITE_APP_NAME

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
