FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json ./

# Clean install.
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.27.3 AS prod

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]