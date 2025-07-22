FROM node:23-slim

WORKDIR /app

COPY package* ./
RUN npm i --omit=dev

COPY . .

RUN npm run build
EXPOSE ${SERVER_PORT}

CMD ["npm", "run", "start:prod"]
