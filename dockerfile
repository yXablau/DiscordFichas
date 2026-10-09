FROM node:22-alpine

WORKDIR /app

COPY discord-server/package.json discord-server/package-lock.json ./discord-server/

WORKDIR /app/discord-server

RUN npm ci --omit=dev

COPY discord-server/server.js ./server.js

WORKDIR /app

COPY index.html style.css script.js ./

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "--use-system-ca", "/app/discord-server/server.js"]