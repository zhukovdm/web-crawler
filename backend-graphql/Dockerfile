FROM node:18.17-bookworm
WORKDIR /opt/backend-openapi

COPY ./ ./
RUN npm ci
RUN npm run build

EXPOSE 3002

ENTRYPOINT ["npm", "run", "serve"]
