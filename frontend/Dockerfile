FROM node:18.17-bookworm AS build
WORKDIR /opt/frontend

ENV REACT_APP_OPENAPI_PORT=${REACT_APP_OPENAPI_PORT}
ENV REACT_APP_GRAPHQL_PORT=${REACT_APP_GRAPHQL_PORT}
ENV REACT_APP_BACKEND_ADDR=${REACT_APP_BACKEND_ADDR}

COPY ./ ./
RUN npm ci
RUN npm run build

FROM node:18.17-bookworm
WORKDIR /opt/frontend

COPY --from=build /opt/frontend/build ./
RUN npm install -g serve

EXPOSE 3000

ENTRYPOINT ["serve", "--single", ".", "--listen", "3000"]
