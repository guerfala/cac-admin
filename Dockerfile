FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN find src -name "*.ts" -exec sed -i "s|http://localhost:8080/api|/api|g" {} + && \
    find src -name "*.ts" -exec sed -i "s|http://localhost:8080||g" {} +
RUN npx ng build --configuration=production

FROM nginx:alpine
COPY --from=build /app/dist/*/browser /usr/share/nginx/html
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
