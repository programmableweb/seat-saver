FROM node:10.13.0-alpine
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 4000
CMD  ["node", "index.js"]