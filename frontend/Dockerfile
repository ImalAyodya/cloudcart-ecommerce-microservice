# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Accept API Gateway URL at build time (Vite inlines VITE_ vars during build)
ARG VITE_API_GATEWAY_URL
ENV VITE_API_GATEWAY_URL=$VITE_API_GATEWAY_URL

COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]