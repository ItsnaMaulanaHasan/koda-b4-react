FROM node:alpine AS builder

WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
RUN sed -i -E 's/(location\s+\/ \{)/\1\n        try_files \$uri \$uri\/ \/index.html;/' /etc/nginx/conf.d/default.conf

EXPOSE 80
