FROM node:20-alpine

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
COPY tsconfig.json .

RUN npm run build

EXPOSE 4003

CMD ["npm", "start"]