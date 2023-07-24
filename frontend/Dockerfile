FROM node:18.17-bookworm
WORKDIR /opt/frontend

COPY . .
RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "start"]
