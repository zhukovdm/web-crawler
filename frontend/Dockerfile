FROM node:18.17-bookworm AS build
WORKDIR /opt/frontend

ARG REACT_APP_OPENAPI_PORT
ARG REACT_APP_GRAPHQL_PORT
ARG REACT_APP_BACKEND_ADDR

ENV REACT_APP_OPENAPI_PORT=${REACT_APP_OPENAPI_PORT}
ENV REACT_APP_GRAPHQL_PORT=${REACT_APP_GRAPHQL_PORT}
ENV REACT_APP_BACKEND_ADDR=${REACT_APP_BACKEND_ADDR}

COPY ./ ./
RUN npm ci
RUN npm run build

FROM nginx:1.25.2

COPY --from=build /opt/frontend/build /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
