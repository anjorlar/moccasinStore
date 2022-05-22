FROM node:alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
EXPOSE 3480
CMD ["node", "src/index.js"]
