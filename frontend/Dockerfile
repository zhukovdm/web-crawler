FROM node:18.17-bookworm AS build
WORKDIR /opt/frontend

COPY ./ ./
RUN npm ci
RUN npm run build

FROM node:18.17-bookworm
WORKDIR /opt/frontend

COPY --from=build /opt/frontend/build ./
RUN npm install -g serve
RUN npm config set update-notifier false

EXPOSE 3000

ENTRYPOINT ["serve", "--single", ".", "--listen", "3000"]
