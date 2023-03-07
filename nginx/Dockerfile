# build stage
FROM node:latest AS builder

RUN mkdir -p /frontend

# WORKDIR /frontend

COPY ./frontend/package.json /frontend

RUN rm -rf /frontend/node_modules

RUN npm install --prefix frontend

COPY ./frontend/ /frontend

RUN npm run build --prefix frontend

# production stage
FROM nginx:latest AS server

COPY --from=builder /frontend/dist /usr/share/nginx/html

RUN rm -f /etc/nginx/conf.d/default.conf

COPY ./nginx/nginx.conf /etc/nginx/conf.d/

CMD ["nginx", "-g", "daemon off;"]
