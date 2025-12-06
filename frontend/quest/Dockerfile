FROM node:alpine3.22
WORKDIR /app
COPY package* .
RUN npm install
COPY . .
RUN npm run build